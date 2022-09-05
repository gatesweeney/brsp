import TeamList from "./TeamList";
import {useState} from "react";
import Grid from "@mui/material/Grid";
import {Button, TextField} from "@mui/material";
import moment from "moment";
import {DatePicker} from "@mui/x-date-pickers";


export default function GameSelector({teams, onSubmit}) {

    const [homeTeam, setHomeTeam] = useState("")
    const [awayTeam, setAwayTeam] = useState("")
    const [gameDate, setGameDate] = useState(moment())

    return (
        <Grid container rowSpacing={2} columnSpacing={2} columns={14} alignItems="center">
            <Grid item xs={14} lg={4}>
                <TeamList teams={teams} initialTeam={homeTeam} placeholder="Away team" onTeamChanged={team => {
                    handleTeamChanged("home", team)
                }} />
            </Grid>
            <Grid item xs={14} lg={4}>
                <TeamList teams={teams} initialTeam={awayTeam} placeholder="Home team" onTeamChanged={team => {
                    handleTeamChanged("away", team)
                }} />
            </Grid>
            <Grid item xs={14} lg={4}>
                <DatePicker
                    label="Game Date"
                    fullWidth
                    value={gameDate}
                    onChange={setGameDate}
                    renderInput={(params) => <TextField fullWidth {...params} />}
                />
            </Grid>
            <Grid item xs={14} lg={2}>
                <Button variant="contained" size="large" onClick={handleSubmit} fullWidth>Submit</Button>
            </Grid>
        </Grid>
    )

    function handleTeamChanged(type, team) {
        type === "home" ? setHomeTeam(team) : setAwayTeam(team)
    }

    function handleSubmit() {
        onSubmit(homeTeam, awayTeam, gameDate)
    }
}