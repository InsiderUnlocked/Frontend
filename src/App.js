// @ Author: Mohammed Al-Rasheed & Farhan Rehman

// Purpose: create website directories and initilze our webpages

// IMPORTS
import {BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom'
import React from 'react';
// Import pages
import CongressTrades from './Components/CongressTrades/CongressTrades';
import TickerDetail from './Components/TickerDetail/TickerDetail';
import CongressPersonDetail from './Components/CongressPersonDetail/CongressPersonDetail';
import CongressPeople from './Components/CongressPeople/CongressPeople';
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
                    <Route path="/Senate-Trades" component={CongressTrades}/>
                    {/*Ticker page*/}
                    <Route path="/Ticker/:ticker" component={TickerDetail}/>
                    {/*Senator Profile Page*/}
                    <Route path="/Senator/:name" component={CongressPersonDetail}/>
                    {/*Shows all the Senate People*/}
                    <Route path="/Senate-People" component={CongressPeople}/>
                    {/*404*/}
                    <Route component={NotFound}/>
                </Switch>
            </div>
        </Router>
    );
}


export default App;