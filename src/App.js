import React, { useEffect, useState } from 'react';
import SportsDataAccessor from "./network/SportsDataAccessor";
import GameSelector from "./components/GameSelector";
import TeamRosterTable from "./components/TeamRosterTable";
import Grid from "@mui/material/Grid";

const sportsDataAccessor = new SportsDataAccessor()
let leagueID = 'mlb';

function App() {

  const [teams, setTeams] = useState([]);
  const [teamsLoaded, setTeamsLoaded] = useState(false);
  const [homeTeamRoster, setHomeTeamRoster] = useState([]);
  const [awayTeamRoster, setAwayTeamRoster] = useState([]);
  const [gameDate, setGameDate] = useState();

  async function handleSubmit(homeTeam, awayTeam, gameDate) {
    const home = await sportsDataAccessor.getRoster(homeTeam)
    const away = await sportsDataAccessor.getRoster(awayTeam)
    if (home.success) {
      setHomeTeamRoster(home.data)
    }
    if (away.success) {
      setAwayTeamRoster(away.data)
    }
    setGameDate(gameDate)
  }

  useEffect(() => {
    (async () => {
      setTeamsLoaded(false);
      sportsDataAccessor.setLeague(leagueID);
      let res = await sportsDataAccessor.getActiveTeams();
      if (res.success) {
        setTeams(res.data);
        setTeamsLoaded(true);
      }
    })();
  }, []);

  return (
    <div>
      {teamsLoaded ? (
          <Grid xs={12} container rowSpacing={2}>
            <Grid xs={12} item>
              <GameSelector teams={teams} onSubmit={handleSubmit} />
            </Grid>
            <Grid xs={12} item>
              <h2>Home Team</h2>
              <br />
              <TeamRosterTable roster={homeTeamRoster} gameDate={gameDate} />
            </Grid>
            <Grid xs={12} item>
              <h2>Away Team</h2>
              <br />
              <TeamRosterTable roster={awayTeamRoster} gameDate={gameDate} />
            </Grid>
          </Grid>
      ) : (<p>Please wait, Loading the application...</p>)}
    </div>
  );
}



export default App;
