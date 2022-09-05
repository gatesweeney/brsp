import React, { useState } from 'react';
import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";

export default function TeamList({teams, initialTeam, placeholder, onTeamChanged}) {

    const [team, setTeam] = useState(initialTeam)

    return (
        <FormControl fullWidth>
            <InputLabel id="team-list-label">{placeholder}</InputLabel>
            <Select
                labelId="team-list-label"
                id="team-list"
                value={team}
                label={placeholder}
                onChange={handleValueChanged}
            >
                <MenuItem id="None" value="">Select a team...</MenuItem>
                {teams.sort((a, b) => a.City.localeCompare(b.City)).map(team =>
                    <MenuItem key={team.Key} value={team.Key}>{`${team.City} ${team.Name} (${team.Key})`}</MenuItem>
                )}

            </Select>
        </FormControl>
    )

    function handleValueChanged(event) {
        const newTeam = event.target.value
        setTeam(newTeam)
        onTeamChanged(newTeam)
    }

}