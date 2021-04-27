import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import { Link, useHistory } from 'react-router-dom';
import Radio from '@material-ui/core/Radio';
import RadionGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel'
import { Collapse } from '@material-ui/core';
import Alert from "@material-ui/lab/Alert";


function CreateRoom({ votes_to_skip=2,guest_can_pause=true,update=false,roomCode=null,updateCallback= ()=>{} }) {
    let history = useHistory();
    const [guestCanPause, setGuestCanPause] = useState(guest_can_pause);
    const [votesToSkip, setVotesToSkip] = useState(votes_to_skip)
    const [successMsg, setSuccessMsg] = useState("")
    const [errorMsg, setErrorMsg] = useState("")

    const handleVotesChange = (e) =>{
        e.preventDefault()
        setVotesToSkip(e.target.value)
    }

    const handleGuestCanPause = (e) =>{
        e.preventDefault()
        setGuestCanPause(e.target.value ==="true" ? true : false)
    }

    const handleCreateRoom = () =>{
        const requestOptions = {
            method : "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify({
                votes_to_skip:votesToSkip,
                guest_can_pause:guestCanPause,
            })
        }

        fetch('/api/create-room', requestOptions)
        .then((response) => response.json())
        .then((data) => history.push(`/room/${data.code}`))
    }

    const handleUpdateRoom = () => {
        const requestOptions = {
            method : "PATCH",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                votes_to_skip:votesToSkip,
                guest_can_pause:guestCanPause,
                code:roomCode,
            })
        }

        fetch('/api/update-room', requestOptions)
        .then((response) =>{
            if(response.ok) {
                setSuccessMsg("Room updated Successfully")
            }else {
                setErrorMsg("Failed to update room")
            }

            updateCallback()
        })

    }

    const title = update ? "Update Room " : "Create a Room"

    const renderCreateButton = () =>{
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <Button color="primary" variant="contained" onClick={handleCreateRoom}>Create a Room</Button>
                </Grid>
                <Grid item xs={12} align="center">
                    <Button color="secondary" variant="contained" to="/" component={Link}>Back</Button>
                </Grid>
            </Grid>
        )
    }

    const renderUpdateButton = () => {
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <Button color="primary" variant="contained" onClick={handleUpdateRoom}>Update a Room</Button>
                </Grid>
            </Grid>
        )
    }

    return (
        <Grid container spacing={1}>
            <Grid item xs={12} align="center">
                <Collapse in={successMsg !="" || errorMsg !=""}>
                    {successMsg !="" ?
                    (<Alert severity="success" onClose={()=> setSuccessMsg("")}>{successMsg}</Alert>) 
                    : (<Alert severity="error" onClose={()=> setErrorMsg("")}>{errorMsg}</Alert>)}
                </Collapse>
            </Grid>
            <Grid item xs={12} align="center">
                <Typography component="h4" variant = "h4">
                    {title}
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <FormControl component="fieldset">
                    <FormHelperText>
                        <div align="center">Guest control of playback state</div>
                    </FormHelperText>
                    <RadionGroup row defaultValue={guestCanPause.toString()} onChange={handleGuestCanPause}>
                        <FormControlLabel 
                        value="true" 
                        control = { <Radio color="primary"/>}
                        label = "Play/Pause"
                        labelPlacement="bottom"
                        />
                        <FormControlLabel 
                        value="false" 
                        control = { <Radio color="secondary"/>}
                        label = "No Control"
                        labelPlacement="bottom"
                        />
                    </RadionGroup>

                </FormControl>
            </Grid>
            <Grid item xs={12} align="center">
                <FormControl>
                    <TextField 
                     required={true}
                     type="number"
                     defaultValue={votesToSkip}
                     onChange={handleVotesChange}
                     inputProps = {{
                         min:1,
                         style:{
                             textAlign:"center"
                         }
                     }}
                    />
                    <FormHelperText>
                     <div align="center">
                         Votes Required To Skip Song
                     </div>
                    </FormHelperText>
                </FormControl>
            </Grid>
            {update ? renderUpdateButton() : renderCreateButton() }
        </Grid>
    )
}

export default CreateRoom
