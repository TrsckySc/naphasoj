import React, { Fragment, useState, useEffect } from "react";
import { Link, withRouter } from "react-router-dom";
import { Menu } from "antd";
import { routes } from "../router";
import { store } from "../store";

function Header(props) {
  const [count, setCount] = useState(-1);

  useEffect(() => {
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].path === props.history.location.pathname) {
        setCount(i);
        store.dispatch({ type: "CHANGE", payload: routes[i].title });
      }
    }
  }, [count, props.history.location.pathname]);

  return (
    <Fragment>
      <div
        style={{
          float: "left",
          fontSize: "20px",
          marginRight: "20px",
          height: "64px",
        }}
      >
        SNAKE-API <small>mini</small>
      </div>
      <Menu
        mode="horizontal"
        selectedKeys={[String(count)]}
        className="float-left"
        onSelect={({ key }) => {
          setCount(key);
          store.dispatch({ type: "CHANGE", payload: routes[key].title });
        }}
      >
        <Menu.Item key={0}>
          <Link to="/">接口列表</Link>
        </Menu.Item>
        <Menu.Item key={1}>
          <Link to="/base-data">响应数据维护</Link>
        </Menu.Item>
        <Menu.Item key={2}>
          <Link to="/prefix">接口前缀维护</Link>
        </Menu.Item>
        <Menu.Item key={3}>
          <Link to="/project">项目配置维护</Link>
        </Menu.Item>
        <Menu.Item key={4}>
          <Link to="/document">文档说明</Link>
        </Menu.Item>
      </Menu>
      <div className="float-right">
        <a
          href="https://www.snake-api.com"
          rel="noopener noreferrer"
          target="_blank"
          className="mr-20"
        >
          SNAKE-API 官网
        </a>
        <a
          href="https://gitee.com/seebin/snake-api-mini/"
          rel="noopener noreferrer"
          target="_blank"
        >
          <img
            src="https://gitee.com/seebin/snake-api-mini/badge/star.svg?theme=dark"
            alt="star"
          ></img>
        </a>
      </div>
    </Fragment>
  );
}

export default withRouter(Header);
