import { Button, ButtonGroup, Grid, Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import {BrowserRouter as Router, Switch, Route, Link, Redirect} from 'react-router-dom';

import CreateRoom from './CreateRoom';
import JoinRoom from './JoinRoom';
import Room from './Room';

function Home() {
    const [roomCode, setRoomCode] = useState(null)

    const renderHomePage= () =>{
        return (
            <Grid container spacing={3}>
                <Grid item xs={12} align="center">
                    <Typography variant="h3" compact="h3">
                        House Party
                    </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <ButtonGroup disableElevation variant="contained" color="primary">
                        <Button color="primary" to='/join' component={Link}>
                            Join a Room
                        </Button>
                        <Button color="secondary" to='/create' component={Link}>
                            Create a Room
                        </Button>
                    </ButtonGroup>
                </Grid>
            </Grid>
        )
    }

    const getUserRoomDetails = () =>{
        fetch(`/api/user-in-room`)
        .then((response) => response.json())
        .then((data) => {
            setRoomCode(data.code)
        })
    }

    useEffect( async () => {
        getUserRoomDetails()
    }, [])

    return (
        <Router>
            <div className="home">
                <Switch>
                    <Route path='/room/:roomCode' component={Room} />
                    <Route path='/join'>
                        <JoinRoom />
                    </Route>
                    <Route path='/create'>
                        <CreateRoom />
                    </Route>
                    <Route path='/' render={ ()=>{
                        return roomCode? (<Redirect to={`/room/${roomCode}`}/>) : (renderHomePage())
                    }} />
                </Switch>
            </div>
        </Router>
    )
}

export default Home
