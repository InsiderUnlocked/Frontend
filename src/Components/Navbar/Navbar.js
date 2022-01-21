// Purpose: Build Navbar Component 

// Imports
import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom'
import './Navbar.css';
import { StockOutlined, UserOutlined} from '@ant-design/icons';
const { Header } = Layout;



  

const Navbar = () => {
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

export default Navbar;