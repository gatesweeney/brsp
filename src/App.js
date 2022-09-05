import './App.css';
import React, { useEffect, useState } from 'react';
import TeamList from "./components/TeamList";
import SportsDataAccessor from "./network/SportsDataAccessor";

function App() {

  const [teams, setTeams] = useState([]);
  const [teamsLoaded, setTeamsLoaded] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState('');

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
    <div className="App">
      {teamsLoaded ? (
          <div>
            <TeamList
                teams={teams}
                onTeamChanged={team => {setSelectedTeam(team)}}
            />
            <p>Selected team: {selectedTeam}</p>
          </div>
      ) : (<p>loading...</p>)}
    </div>
  );
}

export default App;
