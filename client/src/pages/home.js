import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import {
  Form,
  Input,
  Button,
  Table,
  Tag,
  Select,
  Space,
  message,
  Popconfirm,
  Drawer,
  Row,
  Col,
  Radio,
} from "antd";
import {
  PlusCircleOutlined,
  ImportOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  LockOutlined,
  UnlockOutlined,
  CopyOutlined,
} from "@ant-design/icons";
import Axios from "axios";
import JSON5 from "json5"
import { Ace } from "../base/ace";

const { Option } = Select;

export function Home() {
  const [filter, setFilter] = useState({});

  const [tableList, setTableList] = useState([]);

  const [drawer, setDrawer] = useState(false);

  const getListData = (name, url, page) => {
    const param = {
      name,
      url,
      page: 1,
      rows: 20,
    };
    console.log(param);
    Axios.post("/api/get-interface-list", param).then((res) => {
      if (res.data.success) {
        setTableList(res.data.data.list);
      } else {
      }
    });
  };

  const handleInterfaceRef = useRef(null);

  useEffect(() => {
    getListData(filter.name, filter.url, 1);
  }, [filter]);

  function handleTableRow(type, value, id) {
    console.log(type, value, id);
    if (type === "changeMock") {
      Axios.post("/api/change-interface-mock-status", {
        id,
        isOpen: value === "open",
      }).then((res) => {
        if (res.data.success) {
          message.success(value === "open" ? "成功启用" : "接口已停用");
          const table = tableList.map((data) => {
            if (id === data._id) {
              return Object.assign(data, {
                isOpen: value === "open",
              });
            }
            return data;
          });
          // 更改列表数据
          setTableList(table);
        } else {
          message.error(res.data.errorMsg);
        }
      });
    } else if (type === "changeLock") {
      Axios.post("/api/change-interface-lock-status", {
        id,
        isLock: value,
      }).then((res) => {
        if (res.data.success) {
          message.success(
            value ? "接口已锁，将无法编辑与删除操作" : "接口已解锁"
          );
          const table = tableList.map((data) => {
            if (id === data._id) {
              return Object.assign(data, {
                isLock: value,
              });
            }
            return data;
          });
          // 更改列表数据
          setTableList(table);
        } else {
          message.error(res.data.errorMsg);
        }
      });
    } else if (type === "delete") {
      Axios.post("/api/delete-interface", {
        id,
      }).then((res) => {
        if (res.data.success) {
          message.success("删除成功");
          // 重新查询数据
          getListData(filter.name, filter.url, 1);
        } else {
        }
      });
    }
  }

  return (
    <div>
      <Search
        onSearch={(values) => {
          setFilter(values);
        }}
      ></Search>
      <HandleBtn
        initSearch={() => {
          getListData();
        }}
        openDrawer={() => {
          setDrawer(true);
        }}
      ></HandleBtn>
      <PageTable
        dataSource={tableList}
        onHandleTableRow={handleTableRow}
      ></PageTable>

      <Drawer
        title="接口说明"
        placement="left"
        destroyOnClose={true}
        forceRender={true}
        onClose={() => setDrawer(false)}
        visible={drawer}
        width="80%"
        footer={
          <div
            style={{
              textAlign: "right",
            }}
          >
            <Button onClick={() => setDrawer(false)} style={{ marginRight: 8 }}>
              关闭
            </Button>
            <Button type="primary" onClick={() => { handleInterfaceRef.current.onFinish() }}>保存</Button>
          </div>
        }
      >
        <HandleInterface ref={handleInterfaceRef}></HandleInterface>
      </Drawer>
    </div>
  );
}

function Search(props) {
  const [form] = Form.useForm();
  const [, forceUpdate] = useState();

  // To disable submit button at the beginning.
  useEffect(() => {
    forceUpdate({});
  }, []);

  const onFinish = (values) => {
    props.onSearch(values);
  };

  return (
    <Form
      form={form}
      name="horizontal_login"
      layout="inline"
      onFinish={onFinish}
    >
      <Form.Item name="name">
        <Input placeholder="请输入接口名称" />
      </Form.Item>
      <Form.Item name="url">
        <Input placeholder="请输入接口地址" />
      </Form.Item>
      <Form.Item shouldUpdate={true}>
        {() => (
          <Button type="primary" htmlType="submit">
            查 询
          </Button>
        )}
      </Form.Item>
    </Form>
  );
}

function HandleBtn(props) {
  return (
    <div className="pt-20 pb-20 clearfix">
      <div style={{ float: "left" }}>
        <Button
          type="primary"
          onClick={() => props.openDrawer()}
          icon={<PlusCircleOutlined />}
        >
          新建接口
        </Button>
        <Button type="dashed" icon={<ImportOutlined />} className="ml-20">
          导入Swagger 接口
        </Button>
      </div>
      <div style={{ float: "right" }}>
        <Button danger icon={<DeleteOutlined />}>
          清空当前所有接口
        </Button>
      </div>
    </div>
  );
}

function PageTable(props) {
  function handleChange(value, option) {
    props.onHandleTableRow("changeMock", value, option.id);
  }

  const mockStatusList = [
    {
      value: "open",
      label: "启用中",
    },
    {
      value: "close",
      label: "停用中",
    },
  ];

  const columns = [
    {
      title: "序号",
      width: 70,
      align: "center",
      render: (text, record, index) => `${index + 1}`,
    },
    {
      title: "接口名称",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "接口类型",
      dataIndex: "method",
      key: "method",
      align: "center",
      render: (method) => (
        <Tag color={method === "POST" ? "#52c41a" : "#1890ff"}>
          {method.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "接口前缀",
      dataIndex: "prefix",
      key: "prefix",
    },
    {
      title: "接口地址",
      dataIndex: "path",
      key: "path",
      render: (text) => (
        <>
          <CopyOutlined className="pr-10" />
          <span>{text}</span>
        </>
      ),
    },
    {
      title: "Mock启用状态",
      dataIndex: "isOpen",
      key: "isOpen",
      width: 150,
      align: "center",
      render: (text, record, index) => (
        <Select
          defaultValue={record.isOpen ? "open" : "close"}
          style={{
            width: 100,
            color: record.isOpen ? "#52c41a" : "#ff4d4f",
          }}
          onChange={handleChange}
        >
          {mockStatusList.map((mockStatus) => {
            return (
              <Option
                value={mockStatus.value}
                key={mockStatus.value}
                id={record._id}
              >
                {mockStatus.label}
              </Option>
            );
          })}
        </Select>
      ),
    },
    {
      title: "操作",
      width: 270,
      align: "center",
      render: (text, record, index) => (
        <Space>
          {record.isLock ? (
            <>
              <Button
                type="link"
                size="small"
                onClick={() =>
                  props.onHandleTableRow("changeLock", false, record._id)
                }
                icon={<LockOutlined />}
              />
            </>
          ) : (
              <Button
                type="link"
                size="small"
                onClick={() =>
                  props.onHandleTableRow("changeLock", true, record._id)
                }
                icon={<UnlockOutlined />}
              />
            )}
          <Button size="small" type="primary" icon={<EyeOutlined />}>
            查看
          </Button>
          {!record.isLock ? (
            <>
              <Button size="small" icon={<EditOutlined />}>
                编辑
              </Button>
              <Popconfirm
                title="您确定要删除该接口吗?"
                onConfirm={() => {
                  props.onHandleTableRow("delete", null, record._id);
                }}
                okText="确定"
                cancelText="不删了"
              >
                <Button size="small" danger icon={<DeleteOutlined />}>
                  删除
                </Button>
              </Popconfirm>
            </>
          ) : null}
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={props.dataSource}
      rowKey={(record) => record._id}
      pagination={false}
    />
  );
}

let HandleInterface = function (props, ref) {

  useImperativeHandle(ref, () => ({
    onFinish: () => {
      onFinish();
    }
  }));

  const aceRef = useRef(null);

  const [form] = Form.useForm();

  const layout = {
    labelCol: { span: 0 },
    wrapperCol: { span: 24 },
  };

  // 获取响应数据
  const json5Value = (value) => {
    try {
      return JSON5.parse(aceRef.current.getValue());
    } catch (reason) {
      return false;
    }
  }

  const onFinish = () => {
    form.validateFields().then((values) => {
      console.log(values);
      const editorValue = json5Value();
      if (!editorValue) return;

      console.log(editorValue);
    }).catch((error) => {
      console.log(error);
    })
  };

  return (
    <Row>
      {/* 表单项 */}
      <Col span={10} className="pr-10">
        <Form
          {...layout}
          form={form}
          name="basic"
          initialValues={{ method: "GET", prefix: "" }}
        >
          <h4>接口名称</h4>
          <Form.Item
            name="username"
            rules={[{ required: true, message: "请输入接口名称!" }]}
          >
            <Input />
          </Form.Item>

          <h4>请求方式</h4>
          <Form.Item name="method">
            <Radio.Group buttonStyle="solid">
              <Radio.Button value="GET">GET</Radio.Button>
              <Radio.Button value="POST">POST</Radio.Button>
              <Radio.Button value="PUT">PUT</Radio.Button>
              <Radio.Button value="DELETE">DELETE</Radio.Button>
            </Radio.Group>
          </Form.Item>
          <h4>工程前缀</h4>
          <Form.Item name="prefix">
            <Select>
              <Select.Option value="">无接口前缀</Select.Option>
              <Select.Option value="/ylh-service-exchange-dev">/ylh-service-exchange-dev</Select.Option>
            </Select>
          </Form.Item>
          <h4>接口地址</h4>
          <Form.Item
            name="path"
            rules={[{ required: true, message: "请输入接口地址!" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Col>
      {/* 代码编辑与预览 */}
      <Col span={14} className="pl-10">
        <h4>
          <span className="mr-10">响应数据</span>
          <a href="#!" style={{ color: "#6c757d" }}>
            如何生成随机数据?
          </a>
        </h4>
        <div className="clearfix">
          <Radio.Group
            className="float-left"
            defaultValue="1"
            size="small"
            buttonStyle="solid"
          >
            <Radio.Button value="1">编辑</Radio.Button>
            <Radio.Button value="2">预览</Radio.Button>
          </Radio.Group>
          <div className="float-right">
            <Space>
              <a href="#!">初始基础数据</a>
              <a href="#!">初始基础分页数据</a>
            </Space>
          </div>
        </div>
        <div className="pt-10">
          <Ace ref={aceRef}></Ace>
        </div>
      </Col>
    </Row>
  );
}

HandleInterface = forwardRef(HandleInterface);
