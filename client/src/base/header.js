import React, { Fragment } from "react";
import { Link, withRouter } from "react-router-dom";
import { Menu } from "antd";
import { routes } from "../router";

function Header(props) {
  let count = '1';
  for (let i = 0; i < routes.length; i++) {
    if (routes[i].path === props.history.location.pathname) {
      count = `${i + 1}`
    }
  }
  return (
    <Fragment>
      <div style={{ float: 'left', fontSize: '20px', marginRight: '20px', height: '64px' }} >SNAKE-API <small>mini</small></div>
      <Menu mode="horizontal" defaultSelectedKeys={[count]}>
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

export default withRouter(Header);
