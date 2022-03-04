import React, {
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
  useCallback,
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
  Collapse,
  Checkbox,
  Tabs,
  Upload,
  Empty,
  Switch,
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
  ExclamationCircleOutlined,
  GlobalOutlined,
  UploadOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import Axios from "axios";
import JSON5 from "json5";
import { Ace } from "../base/ace";
import { mock } from "mockjs";
import { copyText } from "../utils/copy";
import Swagger from "swagger-client";
import { swaggerHandle } from "../utils/swagger-handle";

const { Option } = Select;
const { TextArea } = Input;
const { Panel } = Collapse;
const { TabPane } = Tabs;

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

  const updateProjectConfig = useCallback(() => {
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

  useEffect(() => {
    updateProjectConfig();
  }, [updateProjectConfig]);

  function handleTableRow(type, value, id, dataSource) {
    if (type === "changeMock") {
      // 切换mock状态
      Axios.post("/api/change-interface-mock-status", {
        id,
        isOpen: value,
      }).then((res) => {
        if (res.data.success) {
          message.success(
            value
              ? "Mock状态开启成功,你可以使用Mock数据了"
              : "Mock状态已停用,你可以使用真实的接口数据了"
          );
          const table = tableList.map((data) => {
            if (id === data._id) {
              return Object.assign(data, {
                isOpen: value,
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
      if (dataSource === 1) {
        // 编辑自建接口
        setDrawerType("edit");
      } else if (dataSource === 3) {
        // 编辑三方接口
        setDrawerType("edit-three");
      } else {
        // 默认自建接口
        setDrawerType("edit");
      }
      setDrawerId(id);
      setDrawer(true);
    } else if (type === "look") {
      // 查看接口
      setDrawerType("look");
      setDrawerId(id);
      setDrawer(true);
    } else if (type === "add") {
      if (dataSource === 1) {
        // 新增自建接口
        setDrawerType("add");
      } else if (dataSource === 3) {
        // 新增三方接口
        setDrawerType("add-three");
      } else {
        // 默认自建接口
        setDrawerType("add");
      }
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

  const deleteAllInterface = () => {
    Modal.confirm({
      title: "您确认要删除所有接口？",
      content: "已经被锁定的接口不会被删除",
      icon: <ExclamationCircleOutlined />,
      okType: "danger",
      okText: "删除",
      onOk() {
        Axios.get("/api/delete-all-interface").then((res) => {
          if (res.data.success) {
            message.success("已成功清空所有未被锁定的接口");
            getListData(filter.name, filter.url, 1);
          } else {
            message.error(res.data.errorMsg);
          }
        });
      },
    });
  };

  return (
    <div>
      <Search
        onSearch={(values) => {
          setFilter(values);
        }}
        projectConfig={projectConfig}
        updateProjectConfig={updateProjectConfig}
      ></Search>
      <HandleBtn
        initSearch={() => {
          getListData();
        }}
        openDrawer={(source) => {
          handleTableRow("add", null, null, source);
        }}
        deleteAllInterface={deleteAllInterface}
      ></HandleBtn>
      <PageTable
        dataSource={tableList}
        onHandleTableRow={handleTableRow}
      ></PageTable>

      <Drawer
        title={
          drawerType === "add" || drawerType === "add-three"
            ? "新增接口"
            : drawerType === "edit" || drawerType === "edit-three"
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
          <div className="clearfix">
            <div
              className="float-left"
              style={{
                lineHeight: "32px",
              }}
            >
              提示:编辑器内使用快捷键 <kbd>Ctrl+Enter</kbd>或
              <kbd>Command+Enter</kbd> 可切换全屏状态
            </div>
            <div
              className="float-right"
              style={{
                textAlign: "right",
              }}
            >
              <Button
                onClick={() => setDrawer(false)}
                style={{ marginRight: 8 }}
              >
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

  const updateConfig = () => {
    Axios.post("/api/update-config-mock", {
      id: props.projectConfig._id,
      mock: !props.projectConfig.mock,
    }).then((res) => {
      if (res.data.success) {
        message.success(
          !props.projectConfig.mock
            ? "已启用项目Mock功能"
            : "已停用项目Mock功能"
        );
        props.updateProjectConfig();
      } else {
        message.error(res.data.errorMsg);
      }
    });
  };

  const changeMock = () => {
    if (props.projectConfig.mock) {
      Modal.confirm({
        title: "您确认要停用Mock功能吗？",
        content: "设置后所有Mock接口将不可用, 服务只保留反向代理功能",
        icon: <ExclamationCircleOutlined />,
        okType: "danger",
        onOk() {
          updateConfig();
        },
      });
    } else {
      updateConfig();
    }
  };

  return (
    <div className="clearfix">
      <Form
        form={form}
        name="horizontal_login"
        layout="inline"
        onFinish={onFinish}
        className="float-left"
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
      <div
        className="float-right cursor-pointer"
        style={{ color: props.projectConfig.mock ? "#28a745" : "#dc3545" }}
        onClick={() => changeMock()}
      >
        <span
          style={{
            display: "inline-block",
            width: "8px",
            height: "8px",
            borderRadius: "4px",
            marginRight: "5px",
            backgroundColor: props.projectConfig.mock ? "#28a745" : "#dc3545",
          }}
        ></span>
        {props.projectConfig.mock ? (
          <span>Mock 启用中...</span>
        ) : (
          <span>Mock 停用中...</span>
        )}
      </div>
    </div>
  );
}

function HandleBtn(props) {
  const [drawer, setDrawer] = useState(false);
  const [urlForm] = Form.useForm();
  const [fileForm] = Form.useForm();
  const [dataList, setDataList] = useState([]);
  const [fileName, setFileName] = useState([]);
  const [tagNameList, setTagNameList] = useState([]);
  const confirmImport = () => {
    // 导入
    const param = [];
    dataList.forEach((data) => {
      data.paths.forEach((path) => {
        path.source = 2;
        if (path.isCheck) param.push(path);
      });
    });
    Axios.post("/api/import-interface", param).then((res) => {
      if (res.data.success) {
        message.success("导入成功");
        props.initSearch();
        setDrawer(false);
      } else {
        message.error(res.data.errorMsg);
      }
    });
  };
  const onChangeTag = (e, data, index) => {
    setDataList(
      dataList.map((tag) => {
        if (tag.name === data.name) {
          tag.paths.forEach((path) => (path.isCheck = e.target.checked));
        }
        return tag;
      })
    );
  };
  const onChangePath = (e, data, pathData) => {
    setDataList(
      dataList.map((tag) => {
        if (tag.name === data.name) {
          tag.paths.forEach((path) => {
            if (pathData.path === path.path) path.isCheck = e.target.checked;
          });
        }
        return tag;
      })
    );
  };
  const stopPropagation = (e) => e.stopPropagation();

  const onFinish = (values, type) => {
    if (type === "url") {
      // url 导入
      Swagger(values.url).then((swaggerData) => {
        if (JSON.stringify(swaggerData.spec) === "{}") {
          message.error("该地址不是标准的JSON数据结构");
          return;
        }
        setDataList(swaggerHandle(swaggerData.spec));
      });
    } else {
      // 文件导入
      const reader = new FileReader();
      reader.readAsText(values.file.file);
      reader.onload = (res) => {
        try {
          res = JSON.parse(res.target.result);

          Swagger({
            spec: res,
          }).then(function (swaggerData) {
            if (JSON.stringify(swaggerData.spec) === "{}") {
              message.error("该地址不是标准的JSON数据结构");
              return;
            }
            setDataList(swaggerHandle(swaggerData.spec));
          });
        } catch (e) {
          console.error("json 解析出错", e.message);
        }
      };
    }
  };

  const onFileChange = (value) => {
    setFileName(value.file.name);
  };
  const openCollapse = () => {
    setTagNameList(
      tagNameList.length > 0 ? [] : dataList.map((data) => data.name)
    );
  };
  const handlePanel = (tagName) => {
    const tagArray = tagNameList.filter((tag) => tagName === tag);
    if (tagArray.length > 0) {
      setTagNameList(tagNameList.filter((tag) => tagName !== tag));
    } else {
      setTagNameList([...tagNameList, tagName]);
    }
  };
  return (
    <div className="pt-20 pb-20 clearfix">
      <div style={{ float: "left" }}>
        <Button
          type="primary"
          onClick={() => props.openDrawer(1)}
          icon={<PlusCircleOutlined />}
        >
          新建接口
        </Button>
        <Button
          type="primary"
          onClick={() => props.openDrawer(3)}
          icon={<PlusCircleOutlined />}
          className="ml-20"
        >
          新建三方接口
        </Button>
        <Button
          onClick={() => setDrawer(true)}
          type="dashed"
          icon={<ImportOutlined />}
          className="ml-20"
        >
          导入Swagger 接口
        </Button>
      </div>
      <div style={{ float: "right" }}>
        <Button
          danger
          onClick={() => props.deleteAllInterface()}
          icon={<DeleteOutlined />}
        >
          清空当前所有接口
        </Button>
      </div>
      <Drawer
        title="导入 Swagger API 接口"
        placement="left"
        destroyOnClose={true}
        forceRender={true}
        onClose={() => {
          urlForm.resetFields();
          fileForm.resetFields();
          setDataList([]);
          setDrawer(false);
        }}
        visible={drawer}
        width="80%"
        footer={
          <div
            style={{
              textAlign: "right",
            }}
          >
            <Button
              onClick={() => {
                urlForm.resetFields();
                fileForm.resetFields();
                setDataList([]);
                setDrawer(false);
              }}
              style={{ marginRight: 8 }}
            >
              关闭
            </Button>
            <Button
              type="primary"
              onClick={() => {
                confirmImport();
                urlForm.resetFields();
                fileForm.resetFields();
                setDataList([]);
              }}
            >
              确认导入
            </Button>
          </div>
        }
      >
        <div>
          <Tabs defaultActiveKey="1">
            <TabPane
              tab={
                <span>
                  <GlobalOutlined />
                  URL 导入
                </span>
              }
              key="1"
            >
              <Form
                layout="inline"
                form={urlForm}
                name="control-hooks"
                onFinish={(values) => onFinish(values, "url")}
              >
                <Form.Item
                  name="url"
                  label="swagger json 地址"
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    获取
                  </Button>
                </Form.Item>
              </Form>
            </TabPane>
            <TabPane
              tab={
                <span>
                  <UploadOutlined />
                  FILE 导入
                </span>
              }
              key="2"
            >
              <Form
                layout="inline"
                form={fileForm}
                name="control-hooks"
                onFinish={(values) => onFinish(values, "file")}
              >
                <Form.Item
                  name="file"
                  label="本地json文件"
                  rules={[
                    { required: true, message: "请选择swagger json文件" },
                  ]}
                >
                  <Upload
                    name="logo"
                    showUploadList={false}
                    beforeUpload={() => {
                      return false;
                    }}
                    fileList={[]}
                    onChange={onFileChange}
                  >
                    <Button>
                      <FileTextOutlined /> 选择文件
                    </Button>
                  </Upload>
                </Form.Item>
                <div style={{ lineHeight: "32px" }} className="mr-20">
                  {fileName}
                </div>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    获取
                  </Button>
                </Form.Item>
              </Form>
            </TabPane>
          </Tabs>
        </div>
        {dataList.length > 0 ? (
          <>
            <div className="pt-20">
              <Button type="dashed" onClick={openCollapse}>
                一键展开/收起
              </Button>
              <div className="float-right" style={{ lineHeight: "32px" }}>
                已经存在的接口地址不会被覆盖导入
              </div>
            </div>
            <div className="pt-20">
              <Collapse activeKey={tagNameList}>
                {dataList.map((data, index) => {
                  return (
                    <Panel
                      header={
                        <div
                          style={{
                            margin: "-12px -16px -12px -40px",
                            padding: "12px 16px 12px 40px",
                            height: "46px",
                          }}
                        >
                          <div
                            style={{
                              margin: "-12px -16px -12px -40px",
                              padding: "12px 16px 12px 40px",
                              height: "46px",
                              width: "100%",
                              position: "absolute",
                            }}
                            onClick={() => handlePanel(data.name)}
                          >
                            <Checkbox
                              indeterminate={data.indeterminate}
                              onChange={(e) => onChangeTag(e, data, index)}
                              onClick={stopPropagation}
                            >
                              <span onClick={stopPropagation}>{data.name}</span>
                            </Checkbox>
                          </div>
                        </div>
                      }
                      key={data.name}
                    >
                      <ul className="m-0" style={{ padding: "0 24px" }}>
                        {data.paths.map((path, pathIndex) => {
                          return (
                            <li
                              style={{
                                padding: "10px 0",
                                listStyle: "none",
                                borderBottom:
                                  pathIndex === data.paths.length - 1
                                    ? null
                                    : "1px #eee solid",
                              }}
                              key={path.path}
                            >
                              <Checkbox
                                checked={path.isCheck}
                                onChange={(e) => onChangePath(e, data, path)}
                                onClick={stopPropagation}
                              >
                                {path.path} {path.name}
                              </Checkbox>
                            </li>
                          );
                        })}
                      </ul>
                    </Panel>
                  );
                })}
              </Collapse>
            </div>
          </>
        ) : (
          <Empty
            style={{ paddingTop: "80px" }}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        )}
      </Drawer>
    </div>
  );
}

function PageTable(props) {
  const sourceFilter = (source) => {
    switch (source) {
      case 1:
        return "自建";
      case 2:
        return "导入";
      case 3:
        return "三方";
      default:
        return "-";
    }
  };
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
      width: 90,
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
      width: 150,
      key: "prefix",
    },
    {
      title: "接口地址",
      dataIndex: "path",
      key: "path",
      render: (text) => (
        <>
          <CopyOutlined onClick={() => copyText(text)} className="pr-10" />
          <span>{text}</span>
        </>
      ),
    },
    {
      title: "来源",
      dataIndex: "source",
      key: "source",
      width: 60,
      render: (text) => sourceFilter(text),
    },
    {
      title: "Mock启用状态",
      dataIndex: "isOpen",
      key: "isOpen",
      width: 150,
      align: "center",
      render: (text, record, index) => (
        <Switch
          checked={record.isOpen}
          style={{
            backgroundColor: record.isOpen ? "#28a745" : "#ff7875",
          }}
          checkedChildren="开"
          unCheckedChildren="关"
          onClick={(checked) => {
            props.onHandleTableRow("changeMock", checked, record._id, null);
          }}
        />
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
                  props.onHandleTableRow("changeLock", false, record._id, null)
                }
                icon={<LockOutlined />}
              />
            </>
          ) : (
            <Button
              type="link"
              size="small"
              onClick={() =>
                props.onHandleTableRow("changeLock", true, record._id, null)
              }
              icon={<UnlockOutlined />}
            />
          )}
          {/* <Button
            size="small"
            onClick={() => props.onHandleTableRow("look", null, record._id, null)}
            type="primary"
            icon={<EyeOutlined />}
          >
            查看
          </Button> */}
          {!record.isLock ? (
            <>
              <Button
                size="small"
                onClick={() =>
                  props.onHandleTableRow(
                    "edit",
                    null,
                    record._id,
                    record.source
                  )
                }
                icon={<EditOutlined />}
              >
                编辑
              </Button>
              <Popconfirm
                title="您确定要删除该接口吗?"
                onConfirm={() => {
                  props.onHandleTableRow("delete", null, record._id, null);
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
  const [baseDataList, setBaseDataList] = useState([]);

  useEffect(() => {
    // 非新增接口查询详情
    if (props.drawerType === "edit" || props.drawerType === "edit-three") {
      Axios.post("/api/get-interface-detail", { id: props.drawerId }).then(
        (res) => {
          if (res.data.success) {
            const data = {
              name: res.data.data.name,
              path: res.data.data.path,
              method: res.data.data.method,
              prefix: res.data.data.prefix,
              threePlatform: res.data.data.threePlatform || "yapi",
              threeDataUrl: res.data.data.threeDataUrl || "",
            };
            form.setFieldsValue(data);
            // setDetailFormData(data);
            if (props.drawerType === "edit") {
              // 回显json5数据
              aceRef.current.editor.setValue(
                JSON5.parse(res.data.data.sourceData)
              );
              setMockData(JSON.stringify(mock(res.data.data.data), null, 4));
            }
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
    Axios.get("/api/get-base-list").then((res) => {
      if (res.data.success) {
        setBaseDataList(res.data.data);
      } else {
        message.error(res.data.errorMsg);
      }
    });
  }, [setPrefixList, setBaseDataList]);

  const changeBaseData = (index) => {
    aceRef.current.editor.setValue(
      index === "" ? "" : JSON.stringify(baseDataList[index].data, null, 2)
    );
  };

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

  const aceBlur = () => {
    try {
      const jsonData = JSON5.parse(aceRef.current.getValue());
      if (!jsonData) {
        setMockData("");
        return;
      }
      setMockData(JSON.stringify(mock(jsonData), null, 2));
    } catch (e) {
      setMockData(
        "错误的JSON数据, 请检查编辑器内数据格式(比如：中文逗号、丢失逗号、丢失括号、错误key)"
      );
    }
  };

  const onFinish = () => {
    form
      .validateFields()
      .then((values) => {
        let source, jsonData, sourceData;
        if (props.drawerType === "add" || props.drawerType === "edit") {
          source = 1;
          jsonData = jsonValue();
          if (!jsonData) return;
          sourceData = JSON5.stringify(aceRef.current.getValue());
        } else {
          source = 3;
        }

        const param = {
          name: values.name,
          path: values.path,
          data: JSON.parse(mockData),
          sourceData,
          method: values.method,
          prefix: values.prefix,
          isOpen: true,
          source,
          threePlatform: values.threePlatform,
          threeDataUrl: values.threeDataUrl,
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
    <Form
      layout={{
        labelCol: { span: 0 },
        wrapperCol: { span: 24 },
      }}
      form={form}
      name="basic"
    >
      <Row>
        {/* 表单项 */}
        <Col span={10} className="pr-10">
          <h4>接口名称</h4>
          <Form.Item
            name="name"
            initialValue={""}
            rules={[{ required: true, message: "请输入接口名称!" }]}
          >
            <Input autoComplete="off" />
          </Form.Item>

          <h4>请求方式</h4>
          <Form.Item name="method" initialValue={"GET"}>
            <Radio.Group buttonStyle="solid">
              <Radio value="GET">GET</Radio>
              <Radio value="POST">POST</Radio>
              <Radio value="PUT">PUT</Radio>
              <Radio value="DELETE">DELETE</Radio>
            </Radio.Group>
          </Form.Item>

          <h4>工程前缀</h4>
          <Form.Item name="prefix" initialValue={""}>
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

          <h4>接口地址</h4>
          <Form.Item
            name="path"
            initialValue={""}
            rules={[{ required: true, message: "请输入接口地址!" }]}
          >
            <Input autoComplete="off" />
          </Form.Item>
        </Col>
        {/* 代码编辑与预览 */}
        <Col span={14} className="pl-10">
          {props.drawerType === "add-three" ||
          props.drawerType === "edit-three" ? (
            <>
              <h4>第三方Mock平台</h4>
              <Form.Item
                name="threePlatform"
                initialValue={"yapi"}
                rules={[{ required: true, message: "请选择第三方Mock平台!" }]}
              >
                <Select>
                  <Select.Option value="easy-mock">Easy-Mock</Select.Option>
                  <Select.Option value="yapi">Yapi</Select.Option>
                </Select>
              </Form.Item>

              <h4>第三方Mock接口地址</h4>
              <Form.Item
                name="threeDataUrl"
                initialValue={""}
                rules={[
                  { required: true, message: "请输入第三方Mock接口地址!" },
                ]}
              >
                <Input
                  autoComplete="off"
                  placeholder="请输入完整的mock请求地址"
                />
              </Form.Item>
            </>
          ) : (
            <>
              <h4>
                <span className="mr-10">响应数据</span>
                {props.drawerType !== "look" ? (
                  <a
                    href="#/document?id=1"
                    target="_blank"
                    style={{ color: "#6c757d" }}
                  >
                    如何生成Mock数据?
                  </a>
                ) : null}
              </h4>
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
                {/* <Popconfirm
                  title="格式化会清空注释，是否继续?"
                  onConfirm={() => {
                    const value = aceRef.current.getValue();
                    if (!value) return;
                    aceRef.current.editor.setValue(
                      JSON5.stringify(JSON5.parse(value), null, 2)
                    );
                  }}
                  okText="确定"
                  cancelText="算了"
                >
                  <Button type="link" size="small">
                    格式化
                  </Button>
                </Popconfirm> */}

                {props.drawerType === "add" ? (
                  <div className="float-right">
                    <span className="mr-10">快捷数据模版:</span>
                    <Select
                      defaultValue=""
                      style={{ width: 200 }}
                      size="small"
                      onChange={changeBaseData}
                    >
                      <Option value="">不使用响应数据模版</Option>
                      {baseDataList.map((baseData, index) => {
                        return (
                          <Option
                            value={index}
                            title={baseData.name}
                            key={index}
                          >
                            {baseData.name}
                          </Option>
                        );
                      })}
                    </Select>
                  </div>
                ) : null}
              </div>

              <div className="pt-10">
                <div
                  style={{
                    display:
                      props.drawerType !== "look" && isEdit ? "block" : "none",
                  }}
                >
                  <Ace
                    ref={aceRef}
                    height="calc(100vh - 220px)"
                    onBlur={aceBlur}
                  ></Ace>
                </div>
                <div
                  style={{
                    display:
                      props.drawerType === "look" || !isEdit ? "block" : "none",
                  }}
                >
                  <TextArea
                    value={mockData}
                    style={{
                      height: "calc(100vh - 220px)",
                      backgroundColor: "#f2f2f2",
                    }}
                    readOnly
                  />
                </div>
              </div>
            </>
          )}
        </Col>
      </Row>
    </Form>
  );
};

HandleInterface = forwardRef(HandleInterface);
