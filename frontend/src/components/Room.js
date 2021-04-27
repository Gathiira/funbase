import { Button, Grid, Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import CreateRoom from './CreateRoom';


function Room(props) {
    const [votesToSkip, setVotesToSkip] = useState(2)
    const [guestCanPause, setGuestCanPause] = useState(false)
    const [isHost, setIsHost] = useState(false)
    const [showSettings, setShowSettings] = useState(false)

    const {roomCode} = props.match.params;
    const history = useHistory()

    const getRoomDetails = () =>{
        fetch(`/api/get-room?code=${roomCode}`)
        .then((response) => {
            if (!response.ok) {
                props.leaveRoomCallback()
                history.push('/')
            }
            return response.json()
        })
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
            props.leaveRoomCallback()
            history.push('/')
        })
    }


    const updateShowSettings = (value) =>{
        setShowSettings(value)
    }

    const renderSettings = () =>{
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <CreateRoom 
                    update={true} 
                    votes_to_skip={votesToSkip} 
                    guest_can_pause={guestCanPause} 
                    roomCode={roomCode}
                    updateCallback = {getRoomDetails}
                    />
                </Grid>
                <Grid item xs={12} align="center">
                    <Button color="secondary" 
                    variant="contained" 
                    onClick={() => updateShowSettings(false)} >Close</Button>
                </Grid>
            </Grid>
        )
    }

    const renderSettingsButton = ()=>{
        return (
            <Grid item xs={12} align="center">
                <Button variant="contained" color="primary" onClick={ () => updateShowSettings(true)}>
                    Settings
                </Button>
            </Grid>
        )
    }

    if (showSettings){
        return renderSettings()
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
            {isHost ? renderSettingsButton() : null}
            <Grid item xs={12} align="center">
                <Button variant="contained" color="secondary" onClick={leaveRoom}>
                    Leave Room
                </Button>
            </Grid>
        </Grid>
    )
}

export default Room