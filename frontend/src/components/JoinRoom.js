import { Grid, Typography, Button, TextField } from '@material-ui/core';
import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom';

function JoinRoom() {
    const history = useHistory();
    const [error, setError] = useState(false)
    const [roomCode, setRoomCode] = useState("")

    const handleTextChange = (e) =>{
        e.preventDefault()
        setRoomCode(e.target.value)
    }

    const joinRoom =() =>{
        const requestOptions = {
            method:"POST",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                code:roomCode
            })
        }

        fetch('api/join-room', requestOptions)
        .then((response)=> {
            if (response.ok) {
                console.log(response.json())
                history.push(`/room/${roomCode}`)
            } else {
                setError("room not found")
            }
        })
        .catch((error) => {
            console.log(error)
        })
    }

    return (
        <Grid container spacing={1} alignItems="center">
            <Grid item xs={12} align="center">
                <Typography component="h4" variant = "h4">
                    Join a Room
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <TextField 
                    error = {error}
                    label = "code"
                    placeholder = "Enter a room code"
                    value = {roomCode}
                    helperText= {error}
                    variant="outlined"
                    onChange={handleTextChange}
                />
            </Grid>

            <Grid item xs={12} align="center">
                <Button variant="contained" color="primary" onClick={joinRoom}>Enter Room</Button>
            </Grid>
            <Grid item xs={12} align="center">
                <Button variant="contained" color="secondary" to="/" component={Link}>Back</Button>
            </Grid>
        </Grid>
    )
}

export default JoinRoom
