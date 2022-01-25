// @Author: Farhan Rehman

// Purpose: Build Navbar Component 

// Imports
import React from 'react';
import { Link } from 'react-router-dom'

import { Layout, Menu } from 'antd';
import { StockOutlined, UserOutlined} from '@ant-design/icons';

// in the navbar's case the layout is the header so we initilize that here
const { Header } = Layout;

function Navbar() {
    return (
        <Header className="header">  
            {/* Logo Text */}
            <Link to="/">
                <div className="logo">Insider Unlocked</div>
            </Link>
            {/* Menu Text */}
            <Menu theme='dark' mode="horizontal">
                <Menu.Item key="SenateTrades" icon={<StockOutlined />}>
                        <Link exact to='/Senate-Trades'>Senate Trades</Link>
                    </Menu.Item>

                    <Menu.Item key="SenateProfiles" icon={<UserOutlined />}>
                        <Link exact to='/Senate-People'>Senate Profiles</Link>
                    </Menu.Item>
            </Menu>
        </Header>
    )
}

// export to reuse in other files
export default Navbar;