// @Author: Mohammed Al-Rasheed
// Purpose: create ticker detail page

// IMPORTS
import React from 'react';
import { Table, Tag } from 'antd';
import FooterComponent from '../Footer/Footer';
import Navbar from '../Navbar/Navbar'
import TradingViewWidget from 'react-tradingview-widget';
import { Themes } from 'react-tradingview-widget';

import reqwest from 'reqwest';
import { Row, Col, Card, Dropdown, Menu, Button } from 'antd';
import { Layout } from "antd";
import { TitleSearch } from "../../Utils/Search/TitleSearch";
import { DownOutlined, DollarOutlined } from "@ant-design/icons";

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
    title: 'Asset Type',
    dataIndex: 'assetType',
    key: 'assetType',
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

// This variable keeps track of dynamic URL params such as how much data the user wants to see per page or what transaction type they want to see to allow features such as filtering 
const getURLParams = params => ({
  // trnasaction type represents the type of transaction the user wants to see
  transactionType: params.transactionType,
  // name represents the search of the user
  name: params.name,
  // Limit represents how much data per page
  limit: params.pagination.pageSize,
  // offset represents how much data is being ignored
  offset: (params.pagination.current - 1) * params.pagination.pageSize,
});

class tickerDetail extends React.Component {
  // variables that we will fetch later on 
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

    // keeps track of the search input of user
    name: "",
    // Initilzing skeleton loaders so that when we are making requests our table and stats dont look ugly
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
    // intilize the transaction type the user wants to see to be able to filter
    transactionType: "",
  };


  // This function is called when this component is first mounted to DOM(meaning when its first visually represented)
  componentDidMount() {
    // We assign the pagination variable what we initilzed earlier in the state variable
    const { pagination } = this.state;
    // validate this variable upon rendering the page to be able to create the table\
    this.fetch({ pagination });
  }

  // function to basically keep track of the pagaination of the table and the interactions of the user with the table
  handleTableChange = (pagination) => {
    // We assign the pagination variable what we initilzed earlier in the state variable
    this.fetch({
      // Update pagination
      pagination,
      // keep the search variable the same
      name: this.state.name,
      // keep the transaction type the same
      transactionType: this.state.transactionType,
    });
  };

  // function to basically keep track of the searches of the user
  handleSearch = (name) => {
    // set the name variable to the search variable
    this.setState({ name });
    // Update other variables
    this.fetch({
      // keep the pagination variable the same
      pagination: this.state.pagination,
      // keep the transaction type the same
      transactionType: this.state.transactionType,
      // set the name variable to the search variable the user inputted
      name,
    });
  };
  // function to basically keep track of the filter input from the user
  handleTransactionTypeFilter = (filterInput) => {
    // set the transaction type variable to the filter input
    this.setState({
      transactionType: filterInput.key,
    })
    // Update other variables
    this.fetch({
      // keep the pagination variable the same
      pagination: this.state.pagination,
      // Update the filter variable to the input the user inputted
      transactionType: filterInput.key,
      // keep the search variable the same
      name: this.state.name,
    });
  };

  fetch = (params = {}) => {
    // set skeleton loaders to true while we make this request
    this.setState({ tableLoading: true, statsLoading: true });
    reqwest({
      // set the url param we want to search
      url: `https://insiderunlocked.herokuapp.com/government/ticker/${this.props.match.params.ticker}/?format=json`,
      method: 'get',
      type: 'json',
      // add the params the user wants to search
      data: getURLParams(params),
      // Upon data retrieval, we will set the data variable to the data we retrieve
    }).then(data => {
      this.setState({
        // Set skeleton loader to false as data is loaded
        tableLoading: false,
        // Assign the data to the data variable
        data: data.results,
        // Assign the pagination variables
        pagination: {
          // spread the pagination variable from its previous
          ...params.pagination,
          // and update only its total to the total number of records we have for the table
          total: data.count - params.pagination.pageSize,
        },
      });
      // if we catch an error from this request it means the ticker simply does not exists so we will redirect the user to the 404 page
    }).catch(err => {
      window.location.href = "/404";
    })
      // after making the request for trades on that ticker we need to make a request to get the stats of the ticker
      .then(() => {
        reqwest({
          url: `https://insiderunlocked.herokuapp.com/government/ticker-stats/${this.props.match.params.ticker}/?format=json`,
          method: "get",
          type: "json",
          // Upon the requeset validiating
        }).then((response) => {
          this.setState({
            stats: {
              // Assign the stats variables
              // use regex to add commas to the numbers to represent money values
              volume: response.results[0].totalVolumeTransactions.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
              total: response.results[0].totalTransactions,
              purchases: response.results[0].purchases,
              sales: response.results[0].sales,
            },
            // set the skeleton loader to off since we recieved the data
            statsLoading: false,
          });
        })

      });
  };

  render() {
    // pass in the params needed to render the page
    const { data, pagination, tableLoading, statsLoading, stats } = this.state;
    return (
      // initlizing layout
      <Layout style={{ marginRight: 0, minHeight: 1100 }}>
        {/* Rendering our navbar*/}
        <Navbar />
        {/* Initilzing our content */}
        <Content>
          <div className="headerSummaryDiv">
            <h1 className="headerSummaryText">Summary stats of ticker: {this.props.match.params.ticker.replace(/-/g, '.')}</h1>
          </div>
          {/* Stats*/}
          <div style={{ marginBottom: 20 }}>
            <Row gutter={[16, 16]} style={{ margin: 10 }}>
              <Col xs={24} xl={8}>
                <Card hoverable title="Number of Transactions" className="smooth-card" loading={statsLoading}>
                  <h1 style={{ fontSize: '30px' }}>{stats.total}</h1>
                  <p style={{ bottom: 0, margin: 0 }}>Total Number of Trades in Disclosure</p>
                </Card>
              </Col>
              <Col xs={24} xl={8}>
                <Card hoverable title="Total Trade Volume" className="smooth-card" loading={statsLoading}>
                  <h1 style={{ fontSize: '30px' }}>${stats.volume}</h1>

                  <p style={{ bottom: 0, margin: 0 }}>Combined Volume of Asset Sales + Purchases</p>
                </Card>
              </Col>
              <Col xs={24} xl={8}>
                <Card hoverable title="Trade Type Ratio" className="smooth-card" loading={statsLoading}>
                  <h1 style={{ fontSize: '30px' }}><font color='green'>{stats.purchases}</font>/<font color='red'>{stats.sales} </font></h1>

                  <p style={{ bottom: 0, margin: 0 }}>Purchases Trades / Sales Trades</p>
                </Card>
              </Col>
            </Row>
          </div>
          <div className="trading-widg">

            {/* Trading Chart*/}
            <TradingViewWidget
              backgroundColor="#141414"
              // replace dashes with periods in this.props.match.params.ticker
              symbol={this.props.match.params.ticker.replace(/-/g, '.')}
              theme={Themes.DARK}
              locale="en"
              autosize

            />

          </div>

          {/* Rendering our search and filter components*/}
          <Row
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
            <Dropdown overlay={
              <Menu onClick={this.handleTransactionTypeFilter}>
                <Menu.Item key="" icon={<DollarOutlined />}>
                  All Transactions
                </Menu.Item>
                <Menu.Item key="Purchase" icon={<DollarOutlined />}>
                  Purchases
                </Menu.Item>
                <Menu.Item key="Sale (Full)" icon={<DollarOutlined />}>
                  Full Sales
                </Menu.Item>
                <Menu.Item key="Sale (Partial)" icon={<DollarOutlined />}>
                  Partial Sales
                </Menu.Item>
              </Menu>
            }>
              <div style={{ marginRight: 20, marginLeft: 20 }} >
                <Button>
                  Filter Transaction Type <DownOutlined />
                </Button>
              </div>
            </Dropdown>
          </Row>
          {/* Rendering our table */}
          <Table
            columns={columns}
            dataSource={data}
            pagination={pagination}
            loading={tableLoading}
            onChange={this.handleTableChange}
            scroll={{ x: "max-content", y: '48vh' }}
            style={{ margin: 20, boxShadow: '1px 1px 1px 1px #ccc' }}

          />
        </Content>
        <FooterComponent />
      </Layout>
    );
  }
}

// export the page to reuse it in other files
export default tickerDetail;