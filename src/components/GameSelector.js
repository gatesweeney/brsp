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
        <Grid container rowSpacing={2}>
            <Grid item xs={4}>
                <p>Home Team</p>
            </Grid>
            <Grid item xs={8}>
                <TeamList teams={teams} initialTeam={homeTeam} onTeamChanged={team => {
                    handleTeamChanged("home", team)
                }} />
            </Grid>
            <Grid item xs={4}>
                <p>Away Team</p>
            </Grid>
            <Grid item xs={8}>
                <TeamList teams={teams} initialTeam={awayTeam} onTeamChanged={team => {
                    handleTeamChanged("away", team)
                }} />
            </Grid>
            <Grid item xs={4}>
                <p>Game Date</p>
            </Grid>
            <Grid item xs={8}>
                <DatePicker
                    label="Game Date"
                    value={gameDate}
                    onChange={setGameDate}
                    renderInput={(params) => <TextField {...params} />}
                />
            </Grid>
            <Grid item xs={12}>
                <Button variant="contained" onClick={handleSubmit} fullWidth>Submit</Button>
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