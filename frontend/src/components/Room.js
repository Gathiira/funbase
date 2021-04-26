import { Button, Grid, Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';


function Room(props) {
    const [votesToSkip, setVotesToSkip] = useState(2)
    const [guestCanPause, setGuestCanPause] = useState(false)
    const [isHost, setIsHost] = useState(false)

    const {roomCode} = props.match.params;
    const history = useHistory()

    const getRoomDetails = () =>{
        fetch(`/api/get-room?code=${roomCode}`)
        .then((response) => response.json())
        .then((data) => {
            setVotesToSkip(data.votes_to_skip)
            setGuestCanPause(data.guest_can_pause)
            setIsHost(data.is_host)
        })
    }

    useEffect(() => {
        getRoomDetails()
    }, [])


    const leaveRoom = () =>{
        const requestOptions = {
            method:"POST",
            headers: {
                "Content-Type":"application/json"
            }
        }
        fetch(`/api/leave-room`, requestOptions)
        .then((_response) => {
            history.push('/')
        })
    }

    return (
        <Grid container spacing={1}>
            <Grid item xs={12} align="center">
                <Typography variant="h4" component="h4">
                    Code: {roomCode}
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <Typography variant="h6" component="h6">
                    Votes: {votesToSkip}
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <Typography variant="h6" component="h6">
                    Guest Can Pause: {guestCanPause?.toString()}
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <Typography variant="h6" component="h6">
                    Host: {isHost?.toString()}
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <Button variant="contained" color="secondary" onClick={leaveRoom}>
                    Leave Room
                </Button>
            </Grid>
        </Grid>
    )
}

export default Room