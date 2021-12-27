import React, { useState, useEffect } from "react";
import { Form, Input, Button, Table, Tag } from 'antd';
import { PlusCircleOutlined, ImportOutlined, DeleteOutlined } from "@ant-design/icons";

export function Home() {
  const [filter, setFilter] = useState({});

  const getListData = (name, url, page) => {
    const param = {
      name,
      url,
      page: 1
    }
    console.log(param);
  }

  useEffect(() => {
    getListData(filter.name, filter.url, 1);
  }, [filter])

  return (
    <div>
      <Search onSearch={(values) => { setFilter(values) }}></Search>
      <HandleBtn initSearch={() => { getListData() }}></HandleBtn>
      <PageTable></PageTable>
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

  const onFinish = values => {
    props.onSearch(values)
  };

  return (
    <Form form={form} name="horizontal_login" layout="inline" onFinish={onFinish}>
      <Form.Item
        name="name"
      >
        <Input placeholder="请输入接口名称" />
      </Form.Item>
      <Form.Item
        name="url"
      >
        <Input
          placeholder="请输入接口地址"
        />
      </Form.Item>
      <Form.Item shouldUpdate={true}>
        {() => (
          <Button
            type="primary"
            htmlType="submit"
          >
            查 询
          </Button>
        )}
      </Form.Item>
    </Form>
  )
}

function HandleBtn() {
  return (
    <div className="pt-20 pb-20 clearfix">
      <div style={{ float: 'left' }}>
        <Button type="primary" icon={<PlusCircleOutlined />}>
          新建接口
        </Button>
        <Button type="dashed" icon={<ImportOutlined />} className="ml-20">
          导入Swagger 接口
        </Button>
      </div>
      <div style={{ float: 'right' }}>
        <Button danger icon={<DeleteOutlined />}>
          清空当前所有接口
      </Button>
      </div>
    </div>
  )
}


function PageTable() {
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: text => <span>{text}</span>,
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Tags',
      key: 'tags',
      dataIndex: 'tags',
      render: tags => (
        <span>
          {tags.map(tag => {
            let color = tag.length > 5 ? 'geekblue' : 'green';
            if (tag === 'loser') {
              color = 'volcano';
            }
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </span>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <span>
          <span style={{ marginRight: 16 }}>Invite {record.name}</span>
          <span>Delete</span>
        </span>
      ),
    },
  ];

  const data = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
      tags: ['nice', 'developer'],
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
      tags: ['loser'],
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
      tags: ['cool', 'teacher'],
    },
  ];
  return (
    <Table columns={columns} dataSource={data} />
  )
}