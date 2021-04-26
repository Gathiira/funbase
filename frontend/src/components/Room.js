import React, { useEffect, useState } from 'react'

function Room(props) {
    const [votesToSkip, setVotesToSkip] = useState(2)
    const [guestCanPause, setGuestCanPause] = useState(false)
    const [isHost, setIsHost] = useState(false)

    const {roomCode} = props.match.params;

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

    return (
        <div>
            <h3>{roomCode}</h3>
            <p>Votes: {votesToSkip}</p>
            <p>Guest Can Pause: {guestCanPause ? "TRUE": "FALSE"}</p>
            <p>Host: {isHost ? "TRUE" : "FALSE"}</p>
        </div>
    )
}

export default Room
