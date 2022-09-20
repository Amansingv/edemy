import { useState, useEffect, useContext } from "react";
import { Menu } from "antd";
import Link from "next/Link";
import {
  AppstoreAddOutlined,
  UserAddOutlined,
  LoginOutlined,
  LogoutOutlined,
  CoffeeOutlined,
} from "@ant-design/icons";
import { Context } from "../context";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

const { Item, SubMenu } = Menu;

const TopNav = () => {
  const [current, setCurrent] = useState("");
  const { state, dispatch } = useContext(Context);
  const { user } = state;

  const router = useRouter();

  useEffect(() => {
    process.browser && setCurrent(window.location.pathname);
    console.log(process.browser);
    console.log(window.location.pathname);
  }, [process.browser && window.location.pathname]);

  const logout = async () => {
    dispatch({ type: "LOGOUT" });
    window.localStorage.removeItem("user");
    const { data } = await axios.get("/api/logout");
    toast(data.message);
    router.push("/login");
  };

  return (
    <>
      <Menu className="d-block" mode="horizontal" selectedKeys={[current]}>
        <Item
          key="/"
          onClick={(e) => setCurrent(e.key)}
          icon={<AppstoreAddOutlined />}
        >
          <Link href="/">
            <a>App</a>
          </Link>
        </Item>
        {user === null && (
          <>
            <Item
              key="/login"
              onClick={(e) => setCurrent(e.key)}
              icon={<LoginOutlined />}
            >
              <Link href="/login">
                <a>Login</a>
              </Link>
            </Item>
            <Item
              key="/register"
              onClick={(e) => setCurrent(e.key)}
              icon={<UserAddOutlined />}
            >
              <Link href="/register">
                <a>Register</a>
              </Link>
            </Item>
          </>
        )}

        {user !== null && (
          <SubMenu
            className="float-end"
            icon={<CoffeeOutlined />}
            title={user && user.name}
          >
            <Item onClick={logout} icon={<LogoutOutlined />}>
              Logout
            </Item>
          </SubMenu>
        )}
      </Menu>
    </>
  );
};

export default TopNav;
