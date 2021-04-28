import React from 'react';
import { Grid, Typography, Card, IconButton,LinearProgress } from '@material-ui/core';

import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import PauseIcon from '@material-ui/icons/Pause';


function Player(props) {
    var {image_url, title, artist,is_playing, duration, progress } = props

    var songprogress = (progress/ duration) * 100;

    return (
        <Card>
            <Grid container alighItems="center">
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
                        <IconButton>
                            {is_playing ? <PauseIcon/> : <PlayArrowIcon/>}
                        </IconButton>
                        <IconButton>
                            <SkipNextIcon />
                        </IconButton>
                    </div>
                </Grid>
            </Grid>
            <LinearProgress variant="determinate" value={songprogress} />
        </Card>
    )
}

export default Player
