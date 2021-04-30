import { Button, Grid, Typography } from '@material-ui/core';
import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import CreateRoom from './CreateRoom';
import Player from './Player'

function Room(props) {
    const [votesToSkip, setVotesToSkip] = useState(2)
    const [guestCanPause, setGuestCanPause] = useState(false)
    const [showSettings, setShowSettings] = useState(false)
    const [spotifyAuth, setSpotifyAuth] = useState(false)
    const [song, setSong] = useState({})

    const isHost = useRef(false)

    const {roomCode} = props.match.params;
    const history = useHistory()


    const getCurrentSong = () => {
        fetch('/spotify/current-song')
        .then((response)=>{
            if(!response.ok){
                return {}
            } else {
                return response.json()
            }
        })
        .then((data) =>{
            console.log(data)
            setSong(data)
        })
    }

    function waitForNewMinute() {
        if (new Date().getSeconds()>1) {
            setTimeout(waitForNewMinute, 500);
        } else {
            var timerID = setInterval(getCurrentSong(),30000);
            if (!spotifyAuth) {
                clearInterval(timerID)
            }
        } 
    }

    waitForNewMinute();

    const isAuthenticated = () => {
        fetch('/spotify/authenticated')
        .then((response)=> response.json())
        .then((data)=> {
            setSpotifyAuth(data.details)
            if (!data.details) {
                fetch('/spotify/get-auth-url')
                .then((response)=> response.json())
                .then((data)=> {
                    window.location.replace(data.url);
                })
            }
        })
    }

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
            isHost.current = data.is_host
            if (isHost.current) {
                isAuthenticated()
            }
        })
        
    }
    useEffect(() => {
        getRoomDetails();
        getCurrentSong();
    }, []);

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
            <Player {...song} />
            {isHost.current ? renderSettingsButton() : null}
            <Grid item xs={12} align="center">
                <Button variant="contained" color="secondary" onClick={leaveRoom}>
                    Leave Room
                </Button>
            </Grid>
        </Grid>
    )
}

export default Room