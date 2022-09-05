import React, { useState } from 'react';

export default function TeamList({teams, onTeamChanged}) {

    const [team, setTeam] = useState('')

    return (
        <select value={team} onChange={handleValueChanged}>
            <option id="None" value="">Select a team...</option>
            {teams.sort((a, b) => a.City.localeCompare(b.City)).map(team =>
                <option id={team.Key} value={team.Key}>{`${team.City} ${team.Name} (${team.Key})`}</option>
            )}
        </select>
    )

    function handleValueChanged(event) {
        const newTeam = event.target.value
        setTeam(newTeam)
        onTeamChanged(newTeam)
    }

}