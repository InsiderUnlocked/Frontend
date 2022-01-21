import React from "react";
import Menu from "antd/lib/menu";
import "antd/lib/menu/style/css";
import Dropdown from "antd/lib/dropdown";
import "antd/lib/dropdown/style/css";
import Icon from "antd/lib/icon";
import "antd/lib/icon/style/css";
import { DownOutlined } from '@ant-design/icons';
import { Button } from 'antd';

export const StatusFilter = ({ filterBy, ...props }) => {
  const onClick = ({ key }) => {
    filterBy(key);
  };

  const menu = (
    <Menu onClick={onClick}>
      <Menu.Item key="1">Status: Complete</Menu.Item>
      <Menu.Item key="2">Status: In Prog    ress</Menu.Item>
      <Menu.Divider />
      <Menu.Item key="3">Clear Filter</Menu.Item>
    </Menu>
  );

  return (
    <div {...props}>
      <Dropdown className="filter" overlay={menu}>
        <Button>
            Filter By: <DownOutlined />
        </Button>
      </Dropdown>
    </div>
  );
};