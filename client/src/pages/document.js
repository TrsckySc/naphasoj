import React, { useState, useEffect } from "react";
import Axios from "axios";
import ReactMarkdown from "react-markdown";
import { Menu } from "antd";

export function Document(props) {
  const [documentList, setDocumentList] = useState([]);
  const [detail, setDetail] = useState("");
  const [selectedKey, setSelectedKey] = useState(["1"]);
  useEffect(() => {
    Axios.get("/api/document-list").then((res) => {
      if (res.data.success) {
        setDocumentList(res.data.data);
      }
    });
    if (props.location.search) {
      const id = props.location.search.substring(1).split("=")[1];
      selectedDocument(Number(id));
      setSelectedKey([id]);
    } else {
      selectedDocument(1);
    }
  }, [setDocumentList]);

  const selectedDocument = (id) => {
    Axios.post("/api/document-detail", { id }).then((res) => {
      if (res.data.success) {
        setDetail(res.data.data);
        setSelectedKey([String(id)]);
      }
    });
  };

  return (
    <div className="d-flex">
      <div>
        <Menu
          style={{ width: 200 }}
          defaultSelectedKeys={[]}
          selectedKeys={selectedKey}
          mode="vertical"
          theme="light"
          onClick={({ key }) => selectedDocument(Number(key))}
        >
          {documentList.map((document) => {
            return <Menu.Item key={document.id}>{document.title}</Menu.Item>;
          })}
        </Menu>
      </div>
      <div className="flex-1 ml-20 p-20 bg-fff">
        <ReactMarkdown source={detail}></ReactMarkdown>
      </div>
    </div>
  );
}
