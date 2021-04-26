import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import { Link } from 'react-router-dom';
import Radio from '@material-ui/core/Radio';
import RadionGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel'


function CreateRoom() {
    const defaultVotes = 2;
    const [guestCanPause, setGuestCanPause] = useState(true);
    const [votesToSkip, setVotesToSkip] = useState(defaultVotes)


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
        .then((data) => console.log(data))
    }

    return (
        <Grid container spacing={1}>
            <Grid item xs={12} align="center">
                <Typography component="h4" variant = "h4">
                    Create a Room
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <FormControl component="fieldset">
                    <FormHelperText>
                        <div align="center">Guest control of playback state</div>
                    </FormHelperText>
                    <RadionGroup row defaultValue="true" onChange={handleGuestCanPause}>
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
                     defaultValue={defaultVotes}
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
            <Grid item xs={12} align="center">
                <Button color="primary" variant="contained" onClick={handleCreateRoom}>Create a Room</Button>
            </Grid>
            <Grid item xs={12} align="center">
                <Button color="secondary" variant="contained" to="/" component={Link}>Back</Button>
            </Grid>
        </Grid>
    )
}

export default CreateRoom
