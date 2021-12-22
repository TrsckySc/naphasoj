import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { Menu } from "antd";

export default function Header() {
  return (
    <Fragment>
      <div className="logo" />
      <Menu mode="horizontal" defaultSelectedKeys={["1"]}>
        <Menu.Item key="1">
          
        </Menu.Item>
        <Menu.Item key="2">nav 2</Menu.Item>
        <Menu.Item key="3">nav 3</Menu.Item>
      </Menu>
    </Fragment>
  );
}
