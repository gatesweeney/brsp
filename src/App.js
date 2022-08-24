import './App.css';
import React, { useEffect, useState } from 'react';

function App() {

  const [teams, setTeams] = useState([]);
  const [teamsLoaded, setTeamsLoaded] = useState(false);

  const fetchTeams = async () => {
    try {
      let response = await fetch('https://api.sportsdata.io/v3/mlb/scores/json/teams?key=787b53b6ed4648dcbc5c12c2b96d9c40');
      let json = await response.json();
      console.log(json)
      return { success: true, data: json };
    } catch (error) {
      console.log(error);
      return { success: false };
    }
  }

  useEffect(() => {
    (async () => {
      setTeamsLoaded(false);
      let res = await fetchTeams();
      if (res.success) {
        setTeams(res.data);
        setTeamsLoaded(true);
      }
    })();
  }, []);

  return (
    <div className="App">
      {teamsLoaded ? (
        <ul>
          {teams.map(team => 
            <li key={team.TeamID}>{team.Key}</li>
          )}
        </ul>
      ) : (<p>loading...</p>)}
    </div>
  );
}

export default App;
