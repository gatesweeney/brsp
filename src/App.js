import React, { useEffect, useState } from 'react';
import SportsDataAccessor from "./network/SportsDataAccessor";
import GameSelector from "./components/GameSelector";
import TeamRosterTable from "./components/TeamRosterTable";
import Grid from "@mui/material/Grid";

function App() {

  const [teams, setTeams] = useState([]);
  const [teamsLoaded, setTeamsLoaded] = useState(false);
  const [homeTeamRoster, setHomeTeamRoster] = useState([]);
  const [awayTeamRoster, setAwayTeamRoster] = useState([]);

  const sportsDataAccessor = new SportsDataAccessor()

  async function handleSubmit(homeTeam, awayTeam, gameDate) {
    const home = await sportsDataAccessor.getRoster(homeTeam)
    const away = await sportsDataAccessor.getRoster(awayTeam)
    if (home.success) {
      setHomeTeamRoster(home.data)
    }
    if (away.success) {
      setAwayTeamRoster(away.data)
    }
  }

  useEffect(() => {
    (async () => {
      setTeamsLoaded(false);
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
              <TeamRosterTable roster={homeTeamRoster} />
            </Grid>
            <Grid xs={12} item>
              <h2>Away Team</h2>
              <br />
              <TeamRosterTable roster={awayTeamRoster} />
            </Grid>
          </Grid>
      ) : (<p>loading...</p>)}
    </div>
  );
}



export default App;
