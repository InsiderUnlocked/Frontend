// Purpose: Build out the page that shows all the senate


// Imports
import React from 'react';
import { Layout, Row, Col, Card, Avatar, Pagination} from 'antd';
import FooterComponent from '../Footer/Footer';
import Navbar from '../Navbar/Navbar'
import reqwest from 'reqwest';
import { TitleSearch } from "../../Utils/Search/TitleSearch";

// Initilze that our content is equal to the layout
const { Content } = Layout;

const { Meta } = Card;


// For pagination to work we need to get the user input, such as page size, and current page number this is what the function does
const getURLParams = (params) => ({
  // Set the name search
  search: params.name,
  
});

class CongressTrades extends React.Component {
  // Static variables that we will fetch later on
  state = {
    // Variable to hold the data we retrieve from our request
    data: [],

    name: "",
    // Initilzing a skeleton loader
    loading: false,
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
      name: this.state.name,
    });
  };

  handleSearch = (name) => {
    // Handles the search, takes the value of the user input
    this.setState({ name });
    // Fetch the data with the new ticker
    this.fetch({
      pagination: this.state.pagination,
      name,
    });
  };
  // Request the info from the backend
  fetch = (params = {}) => {
    // Set the skeleton loader to true while we are making the request
    this.setState({ loading: true });
    reqwest({
      url: 'https://insiderunlocked.herokuapp.com/government/congress-all/?format=json',
      method: 'get',
      type: 'json',
      // Get the user params to validate the pagination for the request URL
      data: getURLParams(params),
      // Upon the requeset validiating
    }).then((data) => {
      console.clear();
      console.log(data.count)
      // Assign variables respectively
      this.setState({
        // Set skeleton loader to false as data is loaded
        loading: false,
        // Assign the data
        data: data.results,
      });
    });
  };

  render() {
    const { data, pagination, loading } = this.state;
    return (
        <Layout style={{ minHeight: 1100}}>
          {/* Rendering our navbar*/}
          <Navbar />
          {/* Initilzing our content */}
          <Content>

           {/* Rendering our Header */}
           <Row style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "10px",
              marginBottom: "10px",
            }}>
            <h1 style={{marginLeft: 25, marginTop: 5}}className="headerSummaryText">All of senate</h1>
            <TitleSearch
              
              onSearch={this.handleSearch}
              style={{ marginRight: 25 }}
            />
          </Row>
          {/* create a grid of cards */}
          <Row gutter={[24, 24]} style={{ margin: 10}}>
            {/* Loop through the data and render the cards */}
            {data.map((item) => (
              <Col xs={24} xl={6} key={item.id}>
                {/* add link to card */}
                <a href={`https://insiderunlocked.web.app/Senator/${item.fullName.replace(/\./g, " ")}`}>
                <Card
                  hoverable
                  className='smooth-card'
                  loading={loading}
                >
                <Meta
                  avatar={<Avatar size={120} src={item.image} />}
                  title={item.fullName}
                  description={item.currentParty+ ', ' + item.currentChamber + ', ' + item.currentState}
                />

                </Card>
                </a>
              </Col>
            ))}
          </Row>
          </Content>
          <FooterComponent />
        </Layout>
    );
  }
}

export default CongressTrades;

// ReactDOM.render(<App />, mountNode);