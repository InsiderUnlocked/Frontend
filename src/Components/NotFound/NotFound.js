// @Author: Farhan Rehman

// Purpose: when invalid url is given redirect to this page

// Import Libraries
import React from 'react';
import { Link } from 'react-router-dom'

import Navbar from '../Navbar/Navbar'
import FooterComponent from '../Footer/Footer';

import { Layout, Button, Result, Content } from 'antd';

const NotFound = () => {  
  return (
      <Layout>
        {/* Rendering our navbar*/}
        <Navbar />
          {/* Initilzing our content */}
          <Content style={{minHeight: 1200}}>
            {/* Rendering our result */}
            <Result
                  status="404"
                  title="404"
                  subTitle="Sorry, the page you visited does not exist."
                  extra={<Link exact to='/'><Button totype="primary">Back Home</Button></Link>}
              />
        </Content>
        {/* Rendering our footer */}
        <FooterComponent />
      </Layout>
  )
}

export default NotFound;