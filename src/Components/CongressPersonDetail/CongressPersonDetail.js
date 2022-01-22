// Purpose: Build out person detail page

// Imports
import React from "react";
import { Card, Table, Tag, Avatar } from "antd";
import { Layout, Col, Row, Button, Menu, Dropdown } from "antd";
import { UserOutlined } from "@ant-design/icons";
import FooterComponent from "../Footer/Footer";
import Navbar from "../Navbar/Navbar";
import { TitleSearch } from "../../Utils/Search/TitleSearch";
import reqwest from "reqwest";
import "./CongressPersonDetail.css";
import { DownOutlined, DollarOutlined } from "@ant-design/icons";

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
    title: "Ticker",
    dataIndex: "ticker",
    key: "ticker",
    render: (text) => (
      text === ("-") ? "Other Assets" : <a href={`https://insiderunlocked.web.app/ticker/${text}`}>{text}</a>
    ),
  },
  {
    title: "Amount",
    dataIndex: "amount",
    key: "amount",
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
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Source",
    dataIndex: "ptrLink",
    key: "ptrLink",
    render: (link) => (
      <a style={{ textDecoration: "none" }} href={link}>
        Source
      </a>
    ),
  },
];

// For pagination to work we need to get the user input, such as page size, and current page number this is what the function does
const getURLParams = (params) => ({
  // Limit represents how much data per page
  limit: params.pagination.pageSize,
  // offset represents how much data is being ignored
  offset: (params.pagination.current - 1) * params.pagination.pageSize,
  // Set the name search
  ticker: params.ticker,
  // Keeps track of the transaction type filtering
  transactionType: params.transactionType,
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
    // Initilzing a skeleton loader
    tableLoading: false,
    statsLoading: false,
    // Keeps track of the user's search
    ticker: "",

    // Initilze stats
    stats: {
      // Intilize the total number of records
      total: "loading...",
      // Intilize the total volume
      volume: "loading...",
      // intilize the number of purchases
      purchases: "loading...",
      // intilize the number of sales
      sales: "loading...",

      image: "",
    },
    personDetail: {
      currentChamber: "",
      currentParty: "",
      currentState: "",
    },

    transactionType: "",
  };
  // This function is called when this component is first mounted to DOM(meaning when its first visually represented)
  componentDidMount() {
    // We assign the pagination variable what we initilzed earlier in the state variable
    const { pagination } = this.state;
    // Fetch this variable
    this.fetch({ pagination });
  }
  // Function called when any changes are done to the table
  handleTableChange = (pagination) => {
    // Fetch the pagination variable to validate the pagination request of the user
    this.fetch({
      pagination,
      ticker: this.state.ticker
    });
  };

  handleSearch = (ticker) => {
    // Handles the search, takes the value of the user input
    this.setState({ ticker });
    // Fetch the data with the new ticker
    this.fetch({
      pagination: this.state.pagination,
      ticker,
    });
  };

  handleTransactionTypeFilter = (filterInput) => {
    this.setState({
      transactionType: filterInput.key,
    })
    this.fetch({
      pagination: this.state.pagination,
      ticker: this.state.ticker,
      transactionType: filterInput.key,
    });
  };
  // Request the info from the backend
  fetch = (params = {}) => {
    // Set the skeleton loader to true while we are making the request
    this.setState({ statsLoading: true, tableLoading: true });
    reqwest({
      url: `https://insiderunlocked.herokuapp.com/government/congress-person/${this.props.match.params.name}/?format=json`,
      method: "get",
      type: "json",
      // Get the user params to validate the pagination for the request URL
      data: getURLParams(params),
    }).catch(err => {
      window.location.href = "/404";
    })
    // Upon the requeset validiating
    .then((data) => {
      console.clear();
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

      // once we gets stats variables, connect to the stats backend
      });
    }).then(() => {
      reqwest({
        url: `https://insiderunlocked.herokuapp.com/government/congress-stats/${this.props.match.params.name}/?format=json`,
        method: "get",
        type: "json",
        // Upon the requeset validiating
      }).then((response) => {
        this.setState({
          // Set skeleton loader to false as data is loaded
          statsLoading: false,
          stats: {
            // Assign the stats variables
            volume: response.results[0].totalVolumeTransactions.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
            total: response.results[0].totalTransactions,
            purchases: response.results[0].purchases,
            sales: response.results[0].sales,
            image: response.results[0].image,
          },
          personDetail: {
            currentChamber: response.results[0].currentChamber,
            currentParty: response.results[0].currentParty,
            currentState: response.results[0].currentState,
          },
        });
      })
      
    });
  };

  render() {
    const { data, pagination, statsLoading, tableLoading, stats, personDetail } = this.state;
    return (
      <Layout style={{ marginRight: 0, minHeight: 1100}}>
        {/* Rendering our navbar*/}
        <Navbar />
        {/* Initilzing our content */}
        <Content>
          {/* Rendering our top card which talks/shows the senator were talking about*/}
          <div
            style={{
              marginLeft: "20px",
              marginRight: "20px",
              marginBottom: "15px",
              marginTop: "15px",
            }}
          >
            <Card
              hoverable
              title={this.props.match.params.name + ": " + personDetail.currentParty+ ', ' + personDetail.currentChamber + ', ' + personDetail.currentState}
              className = "smooth-card"
              loading={statsLoading}
            >
              <Avatar size={125} icon={<UserOutlined />} src={stats.image} />
            </Card>
          </div>

          {/* Rendering our 3 Stats Cards*/}
          <div style={{ marginBottom: 20 }}>
            <Row gutter={[16, 16]} style={{ margin: 10 }}>
              <Col xs={24} xl={8}>
                <Card
                  hoverable
                  title="Number of Transactions"
                  className = "smooth-card"
                  loading={statsLoading}
                >
                  <h1 style={{ fontSize: "30px" }}>{stats.total}</h1>

                  <p style={{ bottom: 0, margin: 0 }}>
                    Total Number of Trades in Disclosure
                  </p>
                </Card>
              </Col>
              <Col xs={24} xl={8}>
                <Card
                  hoverable
                  title="Total Trade Volume"
                  className = "smooth-card"
                  loading={statsLoading}
                >
                  <h1 style={{ fontSize: "30px" }}>${stats.volume}</h1>

                  <p style={{ bottom: 0, margin: 0 }}>
                    Combined Volume of Asset Sales + Purchases
                  </p>
                </Card>
              </Col>
              <Col xs={24} xl={8}>
                <Card
                  hoverable
                  title="Trade Type Ratio"
                  className = "smooth-card"
                  loading={statsLoading}
                >
                  <h1 style={{ fontSize: "30px" }}>
                    <font color="green">{stats.purchases}</font>/<font color="red">{stats.sales}</font>
                  </h1>

                  <p style={{ bottom: 0, margin: 0 }}>
                    Purchases Trades / Sales Trades
                  </p>
                </Card>
              </Col>
            </Row>
          </div>
          {/* Rendering our search and filter component*/}
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
                  <Menu.Item key="Purchase" icon={<DollarOutlined />}>
                    Purchases
                  </Menu.Item>
                  <Menu.Item key="Sale (Full)" icon={<DollarOutlined />}>
                    Full Sales
                  </Menu.Item>
                  <Menu.Item key="Sale (Partial)" icon={<DollarOutlined />}>
                    Partial Sales
                  </Menu.Item>
                  <Menu.Item key="Sale" icon={<DollarOutlined />}>
                    All Sales
                  </Menu.Item>
                </Menu>
              }>
              <div style={{marginRight: 20 }} >
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

export default CongressTrades;