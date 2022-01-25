// @ Author: Mohammed Al-Rasheed & Farhan Rehman

// Purpose: Set up routing for our website; assign a specific path to a specific page

// IMPORTS
import {BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom'
import React from 'react';

// Import pages
import senatorPersonDetail from './Components/CongressPersonDetail/CongressPersonDetail';
import senatePeople from './Components/CongressPeople/CongressPeople';
import senateTrades from './Components/CongressTrades/CongressTrades';
import tickerDetail from './Components/TickerDetail/TickerDetail';
import NotFound from './Components/NotFound/NotFound';

// Parent CSS
import './App.css';

function App() {
    return (
        <Router>
            <div className="">
                <Switch>
                    {/*Redirects to the default page*/}
                    <Redirect exact from="/" to="/Senate-Trades"/>
                    {/*Senate trades*/}
                    <Route path="/Senate-Trades" component={senateTrades}/>
                    {/*Ticker page*/}
                    <Route path="/Ticker/:ticker" component={tickerDetail}/>
                    {/*Senator Profile Page*/}
                    <Route path="/Senator/:name" component={senatorPersonDetail}/>
                    {/*Shows all the Senate People*/}
                    <Route path="/Senate-People" component={senatePeople}/>
                    {/*404*/}
                    <Route component={NotFound}/>
                </Switch>
            </div>
        </Router>
    );
}


export default App;