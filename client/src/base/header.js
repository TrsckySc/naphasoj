import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { Menu } from "antd";

export default function Header() {
  return (
    <Fragment>
      <div style={{float:'left',fontSize:'20px',marginRight:'20px',height:'64px'}} >SNAKE-API <small>mini</small></div>
      <Menu mode="horizontal" defaultSelectedKeys={["1"]}>
        <Menu.Item key="1">
          <Link to="/">接口列表</Link>
        </Menu.Item>
        <Menu.Item key="2">
          <Link to="/base-data">响应数据维护</Link>
        </Menu.Item>
      </Menu>
    </Fragment>
  );
}
