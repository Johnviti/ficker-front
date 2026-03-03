"use client";
import Link from "next/link";
import Image from "next/image";
import CustomMenu from "@/components/CustomMenu";
import { Button, Col, Row, Typography, message, Tour } from "antd";
import type { TourProps } from "antd";
import styles from "./resume.module.scss";
import MyCategoriesList from "@/components/MyCategoriesList";
import LastTransactionsList from "@/components/LastTransactionsList";
import { useEffect, useState, useRef } from "react";
import { request } from "@/service/api";
import { useRouter } from "next/navigation";

interface BalanceProps {
  balance: number;
  planned_spending: number;
  real_spending: number;
}

const Resume = () => {
  const router = useRouter();
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const [balance, setBalance] = useState<BalanceProps>({} as BalanceProps);

  const formatCurrency = (value: any) => {
    if (!value) {
      return null;
    }
    const formattedValue = parseFloat(value).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
    return formattedValue;
  };

  const monthNames = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  const monthName = monthNames[today.getMonth()];

  const dateRange = `${firstDayOfMonth.getDate()} de ${monthName} - ${lastDayOfMonth.getDate()} de ${monthName}`;

  const [showSaldo, setShowSaldo] = useState(true);
  const [iconShowSaldo, setIconShowSaldo] = useState("/icons/icon-hide-saldo.svg");
  const [isEditMode, setIsEditMode] = useState(false);
  const [gastoPlanejado, setGastoPlanejado] = useState("0");

  const [openTour, setOpenTour] = useState(false);
  const refSaldo = useRef(null);
  const refPlanejado = useRef(null);
  const refReal = useRef(null);
  const refCategorias = useRef(null);
  const refTransacoes = useRef(null);
  const refMenu = useRef(null);

  const handleClickShowSaldo = () => {
    setShowSaldo(!showSaldo);
    if (showSaldo) {
      setIconShowSaldo("/icons/icon-show-saldo.svg");
    } else {
      setIconShowSaldo("/icons/icon-hide-saldo.svg");
    }
  };

  const getBalance = async () => {
    try {
      const { data } = await request({
        endpoint: "balance",
      });
      setBalance(data.finances);

      const hasSeenTour = localStorage.getItem("hasSeenOnboardingTour");
      if (!hasSeenTour) {
        try {
          const [catRes, transRes] = await Promise.all([
            request({ method: "GET", endpoint: "categories" }),
            request({ method: "GET", endpoint: "transaction/all" })
          ]);
          const cats = catRes?.data?.data?.categories;
          const trans = transRes?.data?.data?.transactions;
          const bal = data.finances;

          if (
            Number(bal?.balance || 0) === 0 &&
            Number(bal?.planned_spending || 0) === 0 &&
            Number(bal?.real_spending || 0) === 0 &&
            (!cats || cats.length === 0) &&
            (!trans || trans.length === 0)
          ) {
            setOpenTour(true);
          } else {
            // Se o usuário tem dados, presume-se que não é usuário novo 
            // setamos para true para não verificar a api nos próximos acessos.
            localStorage.setItem("hasSeenOnboardingTour", "true");
          }
        } catch (error) {
          console.error(error);
        }
      }
    } catch (error) { }
  };

  const handleClickEditGastoPlanejado = () => {
    setIsEditMode(true);
  };

  const handleBlur = () => {
    setIsEditMode(false);
    // Faça a requisição de atualização aqui com o novo valor (gastoPlanejado)
  };

  const handleKeyDown = async (e: any) => {
    if (e.keyCode === 13) {
      setIsEditMode(false);
      try {
        await request({
          endpoint: "spending/store",
          method: "POST",
          data: {
            planned_spending: gastoPlanejado,
          },
        });
        getBalance();
      } catch (error) {
        message.error("Algo deu errado!");
      }
    }
  };

  useEffect(() => {
    getBalance();
  }, []);

  const handleCloseTour = () => {
    setOpenTour(false);
    localStorage.setItem("hasSeenOnboardingTour", "true");
  };

  const steps: TourProps['steps'] = [
    {
      title: 'Bem-vindo ao Ficker!',
      description: 'Vamos fazer um tour rápido para você conhecer o sistema. Este é o seu Saldo Atual.',
      target: () => refSaldo.current,
    },
    {
      title: 'Gasto Planejado',
      description: 'Aqui você pode definir e visualizar quanto planeja gastar no mês. Clique no ícone de lápis para editar.',
      target: () => refPlanejado.current,
    },
    {
      title: 'Gasto Real',
      description: 'Este é o valor que você já gastou até agora. Fique de olho para não passar do planejado!',
      target: () => refReal.current,
    },
    {
      title: 'Minhas Categorias',
      description: 'Você pode criar categorias customizadas para organizar suas despesas e receitas.',
      target: () => refCategorias.current,
    },
    {
      title: 'Últimas Transações',
      description: 'Aqui aparecerá o histórico das suas movimentações financeiras recentes.',
      target: () => refTransacoes.current,
    },
    {
      title: 'Entradas',
      description: 'Aqui você registra todo o dinheiro que entra, como seu salário e outros ganhos.',
      target: () => document.querySelector('a[href="/EnterTransaction"]')?.closest('.ant-menu-item') as HTMLElement,
    },
    {
      title: 'Saídas',
      description: 'Registre suas despesas, contas e qualquer tipo de gasto de dinheiro.',
      target: () => document.querySelector('a[href="/Outputs"]')?.closest('.ant-menu-item') as HTMLElement,
    },
    {
      title: 'Meus Cartões',
      description: 'Acompanhe as suas faturas de cartões de crédito para ter um controle detalhado.',
      target: () => document.querySelector('a[href="/cards"]')?.closest('.ant-menu-item') as HTMLElement,
    },
    {
      title: 'Análises',
      description: 'Visualize gráficos e relatórios detalhados para entender e planejar seu dinheiro.',
      target: () => document.querySelector('a[href="/analysis"]')?.closest('.ant-menu-item') as HTMLElement,
    },
    {
      title: 'Primeira Entrada',
      description: (
        <div>
          <p style={{ marginBottom: 10 }}>Tudo pronto! Que tal registrar sua primeira movimentação financeira agora?</p>
          <Button type="primary" onClick={() => {
            handleCloseTour();
            router.push('/EnterTransaction');
          }}>
            Fazer primeira entrada
          </Button>
        </div>
      ),
      target: () => document.querySelector('a[href="/EnterTransaction"]')?.closest('.ant-menu-item') as HTMLElement,
    }
  ];

  return (
    <div>
      <div style={{ background: "#fff", padding: 10, alignItems: "center" }}>
        <Link href={"/"} style={{ background: "#fff", padding: 10, alignItems: "center" }}>
          <Image src="/logo.png" alt="Logo" width={130} height={27} />
        </Link>
      </div>
      <div style={{ display: "flex", flexDirection: "row", minHeight: "90vh", backgroundColor: "#f8f9fa" }}>
        <div ref={refMenu}>
          <CustomMenu />
        </div>
        <div style={{ flex: 1, padding: "30px 40px", overflowX: "hidden" }}>
          <Row align={"middle"} justify={"space-between"} style={{ marginBottom: 30 }}>
            <div>
              <h2 style={{ margin: 0, fontWeight: 700, fontSize: "2rem" }}>Olá</h2>
            </div>
            <div>
              <span style={{ color: "#808191", fontSize: "14px", fontWeight: 500 }}>{dateRange}</span>
            </div>
          </Row>

          <Row gutter={[24, 24]} align="stretch">
            <Col xs={24} lg={8} xl={8} style={{ display: "flex", flexDirection: "column" }}>
              <div ref={refSaldo} className={styles.balance} style={{ flex: 1, boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.03)" }}>
                <Row align={"middle"} justify={"space-between"}>
                  <Col>
                    <p className={styles.balance_description}>Saldo</p>
                    <p className={styles.balance_title}>
                      {showSaldo ? formatCurrency(balance.balance) : "****"}
                    </p>
                  </Col>
                  <Col>
                    <Button type="text" onClick={handleClickShowSaldo}>
                      <Image
                        src={iconShowSaldo}
                        alt="Hide/Show"
                        width={24}
                        height={24}
                      />
                    </Button>
                  </Col>
                </Row>
              </div>
            </Col>

            <Col xs={24} lg={8} xl={8} style={{ display: "flex", flexDirection: "column" }}>
              <div ref={refPlanejado} className={styles.balance} style={{ flex: 1, boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.03)" }}>
                <Row align={"middle"} justify={"space-between"}>
                  <Col>
                    <p className={styles.balance_description}>Gasto Planejado</p>
                    {isEditMode ? (
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={gastoPlanejado}
                        onChange={(e) => setGastoPlanejado(e.target.value)}
                        onBlur={handleBlur}
                        onKeyDown={handleKeyDown}
                        autoFocus
                        style={{
                          border: "none",
                          outline: "none",
                          background: "none",
                          boxShadow: "none",
                          width: "90%",
                          fontSize: "1.5rem",
                          fontWeight: 700,
                          padding: 0,
                          color: "#000",
                        }}
                      />
                    ) : (
                      <p className={styles.balance_title}>{formatCurrency(balance.planned_spending)}</p>
                    )}
                  </Col>
                  {!isEditMode && (
                    <Col>
                      <Button type="text" onClick={handleClickEditGastoPlanejado}>
                        <Image
                          src="/edit.png"
                          alt="Editar"
                          width={20}
                          height={20}
                        />
                      </Button>
                    </Col>
                  )}
                </Row>
              </div>
            </Col>

            <Col xs={24} lg={8} xl={8} style={{ display: "flex", flexDirection: "column" }}>
              <div ref={refReal} className={styles.balance} style={{ flex: 1, boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.03)" }}>
                <Row align={"middle"} justify={"space-between"}>
                  <Col>
                    <p className={styles.balance_description}>Gasto Real</p>
                    <p className={styles.balance_title}>{formatCurrency(balance.real_spending)}</p>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>

          <Row gutter={[24, 24]} align="stretch" style={{ marginTop: 24, marginBottom: 24 }}>
            <Col ref={refCategorias} xs={24} lg={12} xl={12} style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ flex: 1 }}>
                <MyCategoriesList />
              </div>
            </Col>
            <Col ref={refTransacoes} xs={24} lg={12} xl={12} style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ flex: 1 }}>
                <LastTransactionsList />
              </div>
            </Col>
          </Row>
        </div>
      </div>
      <Tour open={openTour} onClose={handleCloseTour} steps={steps} />
    </div>
  );
};

export default Resume;
