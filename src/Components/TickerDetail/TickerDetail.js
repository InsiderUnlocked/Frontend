// Purpose: create ticker detail page

// IMPORTS
import React from 'react';
import { Table, Tag } from 'antd';
import FooterComponent from '../Footer/Footer';
import Navbar from '../Navbar/Navbar'
import TradingViewWidget from 'react-tradingview-widget';
import { Themes } from 'react-tradingview-widget';

import "./TickerDetail.css"
import reqwest from 'reqwest';
import {Row, Col, Card } from 'antd';
import { Layout } from "antd";
import { TitleSearch } from "../../Utils/Search/TitleSearch";

// Initilze that our content is equal to the layout
const { Content } = Layout;
// Initilizing the columns of our table
const columns = [
    {
      title: 'Transaction Date',
      dataIndex: 'transactionDate',
      key: 'transactionDate',
    },
    {
      title: 'Ticker',
      dataIndex: 'ticker',
      key: 'ticker',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: "Purchase/Sale",
      key: "transactionType",
      dataIndex: "transactionType",
      render: (type) => (
        <Tag
        // if type has sale in it then color it red
        color={type.includes("Sale") ? "volcano" : "green"}
        key={type.includes("Full") ? "Sale" : type.includes("Partial") ? "Partial Sale" : "Purchase"}
      >
        {type.includes("Full") ? "Sale" : type.includes("Partial") ? "Partial Sale" : "Purchase"}
      </Tag>
      ),
    },
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: text => <a style={{ textDecoration: "none" }} href={`https://insiderunlocked.web.app/Senator/${text}`}>{text}</a>
    },
    {
        title: 'Source',
        dataIndex: 'ptrLink',
        key: 'ptrLink',
        render: link => <a style={{ textDecoration: "none" }} href={link}>Source</a>,
    },
];

// For pagination to work we need to get the user input, such as page size, and current page number
const getURLParams = params => ({
  // Set the name search
  search: params.name,
  // Limit represents how much data per page
  limit: params.pagination.pageSize,
  // offset represents how much data is being ignored
  offset: (params.pagination.current - 1) * params.pagination.pageSize,
});

class CongressTrades extends React.Component {
  // Static variables that we will fetch later on 
  state = {
    // Variable to hold the data we retrieve from our request
    data: [],
    // Keeps track of pagination variables
    pagination: {
      // Current page of the user
      current: 1,
      // Current page size of the user's table
      pageSize: 20,
    },

    name: "",
    // Initilzing a skeleton loader
    tableLoading: false,
    statsLoading: false,
    // Intilize Stats variables
    stats: {
      // Intilize the total number of records
      total: "0",
      // Intilize the total volume
      volume: "0",
      // intilize the number of purchases
      purchases: "0",
      // intilize the number of sales
      sales: "0",
    },
  };


  // This function is called when this component is first mounted to DOM(meaning when its first visually represented)
  componentDidMount() {
    // We assign the pagination variable what we initilzed earlier in the state variable
    const { pagination } = this.state;
    // Fetch this variable
    this.fetch({ pagination });
  }

  // function to basically keep track of the pagaination of the table and the interactions of the user with the table
  handleTableChange = (pagination) => {

    this.fetch({
      pagination,
      name: this.state.name,
    });
  };

  handleSearch = (name) => {
    // Handles the search, takes the value of the user input
    // make this input part of the request url
    this.setState({ name });
    // Fetch the data with the new ticker
    this.fetch({
      pagination: this.state.pagination,
      name,
    });
  };
  
  fetch = (params = {}) => {
    this.setState({ tableLoading: true });
    this.setState({ statsLoading: true });
    // if the reqwest is successful then we will set the data to the data we got from the request if not then redirect to 404

    reqwest({
      url: `https://insiderunlocked.herokuapp.com/government/ticker/${this.props.match.params.ticker}/?format=json`,
      method: 'get',
      type: 'json',
      data: getURLParams(params),
      // Upon data retrieval, we will set the data variable to the data we retrieve
    }).then(data => {
      this.setState({
        // Set skeleton loader to false as data is loaded
        tableLoading: false,
        // Assign the data
        data: data.results,
        // Assign the pagination variables
        pagination: {
          ...params.pagination,
          total: data.count,
        },
      });
    }).catch(err => {
      window.location.href = "/404";
    })
    .then(() => {
      reqwest({
        url: `https://insiderunlocked.herokuapp.com/government/ticker-stats/${this.props.match.params.ticker}/?format=json`,
        method: "get",
        type: "json",
        // Upon the requeset validiating
      }).then((response) => {
        console.clear();
        this.setState({
          stats: {
            // Assign the stats variables
            volume: response.results[0].totalVolumeTransactions.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
            total: response.results[0].totalTransactions,
            purchases: response.results[0].purchases,
            sales: response.results[0].sales,
          },
          statsLoading: false,
        });
      })
      
    });
  };
  
  render() {
    const { data, pagination, tableLoading, statsLoading, stats } = this.state;
    return (
      <Layout style={{ marginRight: 0, minHeight: 1100 }}>
        {/* Rendering our navbar*/}
        <Navbar />
        {/* Initilzing our content */}
        <Content>
          <div className = "headerSummaryDiv">
              <h1 className = "headerSummaryText">Summary stats of ticker: {this.props.match.params.ticker}</h1>
            </div>
            {/* Stats*/}
            <div className="site-card-wrapper" style={{marginBottom: 20}}>
            <Row gutter={[16, 16]} style={{ margin: 10 }}>
              <Col xs={24} xl={8}>
                <Card hoverable title="Number of Transactions" className = "smooth-card" loading={statsLoading}>
                  <h1 style={{ fontSize: '30px' }}>{stats.total}</h1>
                  <p style={{ bottom: 0, margin: 0 }}>Total Number of Trades in Disclosure</p>
                </Card>
              </Col>
              <Col xs={24} xl={8}>
                <Card hoverable title="Total Trade Volume" className = "smooth-card" loading={statsLoading}>
                  <h1 style={{ fontSize: '30px' }}>${stats.volume}</h1>

                  <p style={{ bottom: 0, margin: 0 }}>Combined Volume of Asset Sales + Purchases</p>
                </Card>
              </Col>
              <Col xs={24} xl={8}>
                <Card hoverable title="Trade Type Ratio" className = "smooth-card" loading={statsLoading}>
                  <h1 style={{ fontSize: '30px' }}><font color='green'>{stats.purchases}</font>/<font color='red'>{stats.sales} </font></h1>

                  <p style={{ bottom: 0, margin: 0 }}>Purchases Trades / Sales Trades</p>
                </Card>
              </Col>
            </Row>
          </div>
            <div className="trading-widg">
            
            <TradingViewWidget
              backgroundColor="#141414"
              symbol={this.props.match.params.ticker}
              theme={Themes.DARK}
              locale="en"
              autosize

            />

            </div>

          {/* Rendering our search component*/}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <TitleSearch
              onSearch={this.handleSearch}
              style={{ marginRight: 20 }}
            />
          </div>

            <Table
                columns={columns}
                dataSource={data}
                pagination={pagination}
                loading={tableLoading}
                onChange={this.handleTableChange}
                scroll={{x: "max-content", y: '48vh' }}
                style={{ margin: 20, boxShadow: '1px 1px 1px 1px #ccc'}}

              />
        </Content>
        <FooterComponent />
      </Layout>
    );
  }
}

export default CongressTrades;