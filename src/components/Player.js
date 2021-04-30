import React from 'react';
import { Grid, Typography, Card, IconButton,LinearProgress } from '@material-ui/core';

import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import PauseIcon from '@material-ui/icons/Pause';


function Player(props) {
    var {image_url, title, artist,is_playing, duration, progress, votes, votes_required } = props

    var songprogress = (progress/ duration) * 100;


    const playSong = () =>{
        const requestOptions = {
            method:"PUT",
            headers: {"Content-Type":"application/json"}
        }
        fetch("/spotify/play", requestOptions)

    }

    const pauseSong = () =>{
        const requestOptions = {
            method:"PUT",
            headers: {"Content-Type":"application/json"}
        }
        fetch("/spotify/pause", requestOptions)    
    }

    const skipSong = () =>{
        const requestOptions = {
            method:"POST",
            headers: {"Content-Type":"application/json"}
        }
        fetch("/spotify/skip", requestOptions)    
    }

    return (
        <Card>
            <Grid container>
                <Grid item align="center" xs={4}>
                    <img src={image_url} height="100%" width="100%" alt ="image" />                
                </Grid>
                <Grid item align="center" xs={8}>
                    <Typography component="h5" variant="h5">
                        {title}
                    </Typography>
                    <Typography color="textSecondary" variant="subtitle1">
                        {artist}
                    </Typography>
                    <div>
                        <IconButton onClick={() => {is_playing? pauseSong(): playSong()}}>
                            {is_playing ? <PauseIcon /> : <PlayArrowIcon />}
                        </IconButton>
                        <IconButton onClick={()=> skipSong()}>
                            <SkipNextIcon /> {votes_required>1 ? <>{votes}/{votes_required}</>:null} 
                        </IconButton>
                    </div>
                </Grid>
            </Grid>
            <LinearProgress variant="determinate" value={songprogress} />
        </Card>
    )
}

export default Player
