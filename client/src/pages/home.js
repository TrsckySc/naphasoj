import React, {
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
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
  Modal,
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
import JSON5 from "json5";
import { Ace } from "../base/ace";
import { mock } from "mockjs";

const { Option } = Select;
const { TextArea } = Input;

export function Home(props) {
  const [filter, setFilter] = useState({});

  const [tableList, setTableList] = useState([]);

  const [drawer, setDrawer] = useState(false);

  const [drawerType, setDrawerType] = useState(null);

  const [drawerId, setDrawerId] = useState(null);

  const [projectConfig, setProjectConfig] = useState({});

  const getListData = (name, url, page) => {
    const param = {
      name,
      url,
      page: 1,
      rows: 20,
    };
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

  useEffect(() => {
    Axios.get("/api/get-config").then((res) => {
      if (res.data.success) {
        setProjectConfig(res.data.data);
        if (!res.data.data.target) {
          // 跳转项目配置页面
          Modal.warning({
            title: "警告",
            keyboard: false,
            centered: true,
            maskClosable: false,
            okText: "去设置",
            content: (
              <div>
                <p>检测到你还没有维护代理地址, 请先维护项目代理地址</p>
              </div>
            ),
            onOk() {
              props.history.push("/project");
            },
          });
        }
      } else {
        message.error(res.data.errorMsg);
      }
    });
  }, [setProjectConfig, props.history]);

  function handleTableRow(type, value, id) {
    if (type === "changeMock") {
      // 切换mock状态
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
      // 切换锁
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
      // 删除接口
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
    } else if (type === "edit") {
      // 编辑接口
      setDrawerType("edit");
      setDrawerId(id);
      setDrawer(true);
    } else if (type === "look") {
      // 查看接口
      setDrawerType("look");
      setDrawerId(id);
      setDrawer(true);
    } else if (type === "add") {
      // 新增接口
      setDrawerType("add");
      setDrawerId(null);
      setDrawer(true);
    }
  }

  function saveSuccess() {
    setDrawer(false);
    setTimeout(() => {
      getListData(filter.name, filter.url, 1);
    }, 320);
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
          handleTableRow("add", null, null);
        }}
      ></HandleBtn>
      <PageTable
        dataSource={tableList}
        onHandleTableRow={handleTableRow}
      ></PageTable>

      <Drawer
        title={
          drawerType === "add"
            ? "新增接口"
            : drawerType === "edit"
            ? "编辑接口"
            : "查看接口"
        }
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
            {drawerType !== "look" ? (
              <Button
                type="primary"
                onClick={() => {
                  handleInterfaceRef.current.onFinish();
                }}
              >
                保存
              </Button>
            ) : null}
          </div>
        }
      >
        <HandleInterface
          drawerType={drawerType}
          drawerId={drawerId}
          ref={handleInterfaceRef}
          onSaveSuccess={saveSuccess}
        ></HandleInterface>
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
          onChange={(value) =>
            props.onHandleTableRow("changeMock", value, record._id)
          }
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
          <Button
            size="small"
            onClick={() => props.onHandleTableRow("look", null, record._id)}
            type="primary"
            icon={<EyeOutlined />}
          >
            查看
          </Button>
          {!record.isLock ? (
            <>
              <Button
                size="small"
                onClick={() => props.onHandleTableRow("edit", null, record._id)}
                icon={<EditOutlined />}
              >
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
    },
  }));

  const aceRef = useRef(null);

  const [form] = Form.useForm();

  const [isEdit, setIsEdit] = useState(true);
  const [mockData, setMockData] = useState(null);
  const [detailFormData, setDetailFormData] = useState({});
  const [prefixList, setPrefixList] = useState([]);

  useEffect(() => {
    // 非新增接口查询详情
    if (props.drawerType && props.drawerType !== "add") {
      Axios.post("/api/get-interface-detail", { id: props.drawerId }).then(
        (res) => {
          if (res.data.success) {
            const data = {
              name: res.data.data.name,
              path: res.data.data.path,
              method: res.data.data.method,
              prefix: res.data.data.prefix,
            };
            form.setFieldsValue(data);
            setDetailFormData(data);
            // 回显json5数据
            aceRef.current.editor.setValue(
              JSON5.parse(res.data.data.sourceData)
            );
            setMockData(JSON.stringify(mock(res.data.data.data), null, 4));
          } else {
            message.error(res.data.errorMsg);
          }
        }
      );
    }
  }, [props.drawerType, props.drawerId, form]);

  useEffect(() => {
    Axios.get("/api/get-prefix-list").then((res) => {
      if (res.data.success) {
        setPrefixList(res.data.data);
      } else {
        message.error(res.data.errorMsg);
      }
    });
  }, [setPrefixList]);

  // 获取响应数据
  const jsonValue = () => {
    if (!aceRef.current.getValue()) {
      message.error("请输入响应数据");
      return false;
    }
    try {
      return JSON5.parse(aceRef.current.getValue());
    } catch (reason) {
      console.log(reason);
      message.error("json 解析出错");
      return false;
    }
  };

  const onFinish = () => {
    form
      .validateFields()
      .then((values) => {
        const jsonData = jsonValue();
        if (!jsonData) return;

        const param = {
          name: values.name,
          path: values.path,
          data: mock(jsonData),
          sourceData: JSON5.stringify(aceRef.current.getValue()),
          method: values.method,
          prefix: values.prefix,
          isOpen: true,
        };

        let url;

        if (props.drawerId) {
          url = "/api/update-interface";
          param.id = props.drawerId;
        } else {
          url = "/api/add-interface";
        }

        Axios.post(url, param).then((res) => {
          if (res.data.success) {
            props.onSaveSuccess();
            message.success("保存成功");
          } else {
            message.error(res.data.errorMsg);
          }
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Row>
      {/* 表单项 */}
      <Col span={10} className="pr-10">
        <Form
          layout={{
            labelCol: { span: 0 },
            wrapperCol: { span: 24 },
          }}
          form={form}
          name="basic"
          initialValues={{
            name: "",
            path: "",
            method: "GET",
            prefix: "",
          }}
        >
          <h4>接口名称</h4>
          {props.drawerType !== "look" ? (
            <Form.Item
              name="name"
              rules={[{ required: true, message: "请输入接口名称!" }]}
            >
              <Input autoComplete="off" />
            </Form.Item>
          ) : (
            <ul>
              <li>{detailFormData.name}</li>
            </ul>
          )}

          <h4>请求方式</h4>
          {props.drawerType !== "look" ? (
            <Form.Item name="method">
              <Radio.Group buttonStyle="solid">
                <Radio value="GET">GET</Radio>
                <Radio value="POST">POST</Radio>
                <Radio value="PUT">PUT</Radio>
                <Radio value="DELETE">DELETE</Radio>
              </Radio.Group>
            </Form.Item>
          ) : (
            <ul>
              <li>{detailFormData.method}</li>
            </ul>
          )}

          <h4>工程前缀</h4>
          {props.drawerType !== "look" ? (
            <Form.Item name="prefix">
              <Select>
                <Select.Option value="">无接口前缀</Select.Option>
                {prefixList.map((prefix) => {
                  return (
                    <Select.Option value={prefix.code} key={prefix.code}>
                      {prefix.code}
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
          ) : (
            <ul>
              <li>{detailFormData.prefix}</li>
            </ul>
          )}

          <h4>接口地址</h4>
          {props.drawerType !== "look" ? (
            <Form.Item
              name="path"
              rules={[{ required: true, message: "请输入接口地址!" }]}
            >
              <Input autoComplete="off" />
            </Form.Item>
          ) : (
            <ul>
              <li>{detailFormData.path}</li>
            </ul>
          )}
        </Form>
      </Col>
      {/* 代码编辑与预览 */}
      <Col span={14} className="pl-10">
        <h4>
          <span className="mr-10">响应数据</span>
          {props.drawerType !== "look" ? (
            <a href="#!" style={{ color: "#6c757d" }}>
              如何生成随机数据?
            </a>
          ) : null}
        </h4>
        {props.drawerType !== "look" ? (
          <div className="clearfix">
            <Radio.Group
              className="float-left"
              defaultValue="1"
              size="small"
              buttonStyle="solid"
              onChange={(e) =>
                e.target.value === "1" ? setIsEdit(true) : setIsEdit(false)
              }
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
        ) : null}

        <div className="pt-10">
          <div
            style={{
              display: props.drawerType !== "look" && isEdit ? "block" : "none",
              border: "1px #eee solid",
            }}
          >
            <Ace ref={aceRef} height="400px"></Ace>
          </div>
          <div
            style={{
              display:
                props.drawerType === "look" || !isEdit ? "block" : "none",
            }}
          >
            <TextArea
              value={mockData}
              style={{ height: "400px", backgroundColor: "#f2f2f2" }}
              readOnly
            />
          </div>
        </div>
      </Col>
    </Row>
  );
};

HandleInterface = forwardRef(HandleInterface);
