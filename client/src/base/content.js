import React, { useState } from "react";
import { Breadcrumb } from "antd";
import { store } from "../store";

export default function Content(props) {
  const warp = {
    padding: "66px 20px 0 20px",
    minHeight: "calc(100vh - 42px)",
  };
  const [name, setName] = useState(store.getState());

  store.subscribe(() => {
    setName(store.getState());
  });

  return (
    <div style={warp}>
      <Breadcrumb style={{ padding: "10px 0" }}>
        <Breadcrumb.Item>{name}</Breadcrumb.Item>
      </Breadcrumb>
      {props.children}
    </div>
  );
}
