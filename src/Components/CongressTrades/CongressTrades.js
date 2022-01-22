// @Author: Mohammed Al-Rasheed

// Purpose: Build out our main page which is the trades of the congress

// Imports
import React from "react";
import { Table, Tag, Card, Col, Row, Dropdown, Button, Layout, Menu } from "antd";
import FooterComponent from "../Footer/Footer";
import Navbar from "../Navbar/Navbar";
import reqwest from "reqwest";
import { TitleSearch } from "../../Utils/Search/TitleSearch";
import { DownOutlined, SlidersOutlined, DollarOutlined } from "@ant-design/icons";
import { Adsense } from '@ctrl/react-adsense';

// Initilze that our content is equal to the layout
const { Content } = Layout;
// Initilze our columns
const columns = [
  {
    title: "Transaction Date",
    dataIndex: "transactionDate",
    key: "transactionDate",
  },
  {
    title: 'Asset Type',
    dataIndex: 'assetType',
    key: 'assetType',
  },
  {
    title: "Ticker",
    dataIndex: "ticker",
    key: "ticker",
    render: (text) => (
      // if ticker is a dash that means its not a stock so its not valid
      // replace each dot with a dash in text
      text === ("-") ? "N/A" :  <a href={`https://insiderunlocked.web.app/ticker/${text.replace(/\./g,'-')}`}>{text}</a>
    ),
  },
  {
    title: "Amount",
    dataIndex: "amount",
    key: "amount",
  },
  {
    title: "Transaction Type",
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
    title: "Name",
    dataIndex: "name",
    key: "name",
    render: (text) => (
      <a href={`https://insiderunlocked.web.app/Senator/${text.replace(/\./g, " ")}`}>{text}</a>
    ),
  },
  {
    title: "Source",
    dataIndex: "ptrLink",
    key: "ptrLink",
    render: (link) => <a href={link}>Source</a>,
  },
];


// This variable keeps track of dynamic URL params such as how much data the user wants to see per page or what transaction type they want to see to allow features such as filtering 
const getURLParams = (params) => ({
  // search represents the search of the user 
  search: params.search,
  // Limit represents how much data per page
  limit: params.pagination.pageSize,
  // offset represents how much data is being ignored
  offset: (params.pagination.current - 1) * params.pagination.pageSize,
  // trnasaction type represents the type of transaction the user wants to see
  transactionType: params.transactionType,
});

class senateTrades extends React.Component {
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
    search: "",
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
    // Keeps track of the time frame for the stats we are showing
    summary: "90",
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
    // Fetch the pagination variable to validate the pagination request of the user
    this.fetch({
      // Update pagination
      pagination,
      // keep the search variable the same
      search: this.state.search,
      // keep the transaction type the same
      transactionType: this.state.transactionType,
      // keep the summary variable the same
      summary: this.state.summary,
    });

  };

  // function to basically keep track of the searches of the user
  handleSearch = (search) => {
    // Fetch the search variable to validate the search request of the user
    this.setState({ search });
    // update other variables
    this.fetch({
      // update the search variable
      search,
      // keep the pagination variable the same
      pagination: this.state.pagination,
      // keep the transaction type the same
      transactionType: this.state.transactionType,
      // keep the summary timeframe variable the same
      summary: this.state.summary,
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
      // keep the search variable the same
      search: this.state.search,
      // update the transaction type variable
      transactionType: filterInput.key,
      // keep the summary variable the same
      summary: this.state.summary,
    });
  };

  // function to handle summary time frame changes per user's input
  handleSummaryMenuClick = (e) => {
    // set the summary variable to the summary timeframe the user selected
    this.setState({
      summary: e.key,
    });
    // make it fetch the data with the new summary variable
    this.fetch({
      // keep the pagination variable the same
      pagination: this.state.pagination,
      // keep the search variable the same
      search: this.state.search,
      // keep the transaction type variable the same
      transactionType: this.state.transactionType,
      // update the summary variable
      summary: e.key,
    });
  };


  // Request the info from the backend
  fetch = (params = {}) => {
    // Set the skeleton loader to true while we are making the request
    this.setState({ tableLoading: true, statsLoading: true });
    reqwest({
      url: "https://insiderunlocked.herokuapp.com/government/congress-trades/?format=json",
      method: "get",
      type: "json",
      // Get the user params to validate the pagination for the request URL
      data: getURLParams(params),
      // Upon the requeset validiating
    }).then((data) => {
      // Assign variables respectively
      this.setState({
        // Set skeleton loader to false as data is loaded
        tableLoading: false,
        // Assign the data
        data: data.results,
        // Assign the pagination variables
        pagination: {
          ...params.pagination,
          total: data.count - params.pagination.pageSize,
        },

      });
    }).then(() => {
      reqwest({
        url: `https://insiderunlocked.herokuapp.com/government/summary-stats/${this.state.summary}/?format=json`,
        method: "get",
        type: "json",
        // Upon the requeset validiating
      }).then((response) => {
        this.setState({
          statsLoading: false,
          stats: {

            // Assign the stats variables
            volume: response.results[0].totalVolume.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
            total: response.results[0].total,
            purchases: response.results[0].purchases,
            sales: response.results[0].sales,
          },
        });
      })

    });
  };

  render() {
    // pass in variables to show within our webpage
    const { data, pagination, tableLoading, statsLoading, stats, summary } = this.state;
    return (
      <Layout style={{ marginRight: 0, minHeight: 1000 }}>
        {/* Rendering our navbar*/}
        <Navbar />
        {/* Initilzing our content */}
        <Content>
          {/* Rendering our Header Summary Text*/}
          <Row className="headerSummaryDiv">
            <h1 className="headerSummaryText">Summary for the last {summary} days</h1>
            <Dropdown className="Dropdown" overlay={
              <Menu onClick={this.handleSummaryMenuClick}>
                <Menu.Item key="30" icon={<SlidersOutlined />}>
                  Last 30 Days
                </Menu.Item>
                <Menu.Item key="60" icon={<SlidersOutlined />}>
                  Last 60 Days
                </Menu.Item>
                <Menu.Item key="90" icon={<SlidersOutlined />}>
                  Last 90 Days
                </Menu.Item>
                <Menu.Item key="120" icon={<SlidersOutlined />}>
                  Last 120 Days
                </Menu.Item>
              </Menu>
            }>
              <div style={{ marginTop: 3 }}>
                <Button>
                  Filter Summary Stats <DownOutlined />
                </Button>
              </div>
            </Dropdown>
          </Row>

          {/* Rendering our 3 Stats Cards*/}
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
                  <h1 style={{ fontSize: '30px' }}><font color='green'>{stats.purchases}</font>/<font color='red'>{stats.sales}</font></h1>

                  <p style={{ bottom: 0, margin: 0 }}>Purchases Trades / Sales Trades</p>
                </Card>
              </Col>
            </Row>
          </div>

          <Adsense
            client="ca-pub-7640562161899788"
            slot="7640562161899788"
            style={{ display: 'block' }}
            layout="in-article"
            format="fluid"
          />

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
            // Assign columns
            columns={columns}
            // Assign data
            dataSource={data}
            // Assign pagination
            pagination={pagination}
            // Assign skeleton loader
            loading={tableLoading}
            // On change to this table call the handleTableChange function
            onChange={this.handleTableChange}
            // Some styling
            scroll={{ x: "max-content", y: "48vh" }}
            style={{ margin: 20, boxShadow: "1px 1px 1px 1px #ccc" }}
          />
        </Content>
        <FooterComponent />
      </Layout>
    );
  }
}

export default senateTrades;