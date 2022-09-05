import React, { useEffect, useState } from 'react';
import SportsDataAccessor from "./network/SportsDataAccessor";
import GameSelector from "./components/GameSelector";

function App() {

  const [teams, setTeams] = useState([]);
  const [teamsLoaded, setTeamsLoaded] = useState(false);

  const sportsDataAccessor = new SportsDataAccessor()

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
          <div>
            <GameSelector teams={teams} onSubmit={handleSubmit} />
          </div>
      ) : (<p>loading...</p>)}
    </div>
  );
}

function handleSubmit(homeTeam, awayTeam, gameDate) {
  console.log(`Home team: ${homeTeam}, away team: ${awayTeam}, game date: ${gameDate}`)
}

export default App;
