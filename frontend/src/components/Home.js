import React from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

import CreateRoom from './CreateRoom';
import JoinRoom from './JoinRoom';
function Home() {
    return (
        <Router>
            <div className="home">
                <Switch>
                    <Route path='/join'>
                        <JoinRoom />
                    </Route>
                    <Route path='/create'>
                        <CreateRoom />
                    </Route>
                    <Route path='/'>
                        <p>Home page</p>
                    </Route>
                </Switch>
            </div>
        </Router>
    )
}

export default Home
