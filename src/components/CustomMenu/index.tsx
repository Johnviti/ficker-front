import React, { useState } from "react";
import type { MenuProps } from "antd";
import { Menu } from "antd";
import Image from "next/image";
import "./styles.scss";
import { useRouter } from "next/navigation";
import { Cookies } from "react-cookie";
import { BarsOutlined } from "@ant-design/icons";
import useMediaQuery from "use-media-antd-query";

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: "group"
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem(
    "Início",
    "1",
    <Image src="/despesas.svg" alt="Logo" width={25} height={25} />
  ),
  getItem(
    "Entradas",
    "2",
    <Image src="/bolsa-de-dinheiro.svg" alt="Logo" width={25} height={25} />
  ),
  getItem(
    "Saídas",
    "3",
    <Image src="/wallet.svg" alt="Logo" width={25} height={25} />
  ),
  getItem(
    "Meus cartões",
    "4",
    <Image src="/cartoes-de-credito.svg" alt="Logo" width={25} height={25} />
  ),
  getItem(
    "Análises",
    "5",
    <Image src="/analise.svg" alt="Logo" width={25} height={25} />
  ),
  getItem(
    "Sair",
    "7",
    <Image
      src="/exit1.svg"
      alt="Logo"
      width={25}
      height={25}
    />
  ),
];

const paths: Record<string, string> = {
  "1": "/",
  "2": "/EnterTransaction",
  "3": "/Outputs",
  "4": "/cards",
  "5": "/analysis",
};

const CustomMenu: React.FC = () => {
  const router = useRouter();
  const cookie = new Cookies();
  const menu = cookie.get("menu");
  const colSize = useMediaQuery();
  const [showMenu, setShowMenu] = useState<boolean>(colSize === "xs" ? false : true);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <div>
      <BarsOutlined onClick={toggleMenu} className="burger-icon" />
      {showMenu && (
        <Menu
          style={{ width: 250, height: "90vh" }}
          defaultSelectedKeys={menu ? [menu.toString()] : ["1"]}
          mode="inline"
          items={items}
          onClick={({ key }) => {
            cookie.set("menu", key);
            if (key === "7") {
              cookie.remove("menu");
              localStorage.clear();
              window.location.href = "/login";
            } else if (paths[key as string]) {
              router.push(paths[key as string]);
            }
          }}
        />
      )}
    </div>
  );
};

export default CustomMenu;
