// @Author: Farhan Rehman

// Purpose: Build out the page that shows all the senate


// Imports
import React from 'react';
import { Layout, Row, Col, Card, Avatar} from 'antd';
import FooterComponent from '../Footer/Footer';
import Navbar from '../Navbar/Navbar'
import reqwest from 'reqwest';
import { TitleSearch } from "../../Utils/Search/TitleSearch";

// Initilze that our content is equal to the layout
const { Content } = Layout;
// Create abstract card for better looks refer to ANT Design documentation to understand better
const { Meta } = Card;


// This variable keeps track of dynamic URL params such as how much data the user wants to see per page or what transaction type they want to see to allow features such as filtering 
const getURLParams = (params) => ({
  // Set the search variable
  search: params.name,
});

class senatePeople extends React.Component {
  // Static variables that we will fetch later on
  state = {
    // Variable to hold the data we retrieve from our request
    data: [
      // to make requests based of name
    ],
    // variable to hold the search input of the user
    name: "",
    // Initilzing a skeleton loader for the cards
    loading: false,
  };

  // This function is called when this component is first mounted to DOM(meaning when its first visually represented)
  componentDidMount() {
    // fetch the data to start the page
    const { data } = this.state;
    this.fetch({ data });
  }


  // function to basically keep track of the searches of the user
  handleSearch = (name) => {
    // Fetch the search variable to validate the search request of the user and set the user input to the search variable
    this.setState({ name });
    // update other variables
    this.fetch({ 
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
      // Get the user params to validate the request URL
      data: getURLParams(params),
      // Upon the requeset validiating
    }).then((data) => {
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
    // pass in parameter we want to use in the webpage
    const { data, loading } = this.state;
    return (
        <Layout style={{ minHeight: 1100}}>
          {/* Rendering our navbar*/}
          <Navbar />
          {/* Initilzing our content */}
          <Content style={{marginBottom: 10}}>

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
                <a href={`https://insiderunlocked.com/Senator/${item.fullName}`}>
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

export default senatePeople;

