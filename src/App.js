import React, { useEffect, useState } from 'react';
import SportsDataAccessor from "./network/SportsDataAccessor";
import GameSelector from "./components/GameSelector";
import TeamRosterTable from "./components/TeamRosterTable";
import Grid from "@mui/material/Grid";
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
//import $ from "jquery";

const sportsDataAccessor = new SportsDataAccessor()
let leagueID = 'mlb';

function getAllUrlParams(url) {

  // get query string from url (optional) or window
  var queryString = url ? url.split('?')[1] : window.location.search.slice(1);

  // we'll store the parameters here
  var obj = {};

  // if query string exists
  if (queryString) {

    // stuff after # is not part of query string, so get rid of it
    queryString = queryString.split('#')[0];

    // split our query string into its component parts
    var arr = queryString.split('&');

    for (var i = 0; i < arr.length; i++) {
      // separate the keys and the values
      var a = arr[i].split('=');

      // set parameter name and value (use 'true' if empty)
      var paramName = a[0];
      var paramValue = typeof (a[1]) === 'undefined' ? true : a[1];

      // (optional) keep case consistent
      paramName = paramName.toLowerCase();
      if (typeof paramValue === 'string') paramValue = paramValue.toLowerCase();

      // if the paramName ends with square brackets, e.g. colors[] or colors[2]
      if (paramName.match(/\[(\d+)?\]$/)) {

        // create key if it doesn't exist
        var key = paramName.replace(/\[(\d+)?\]/, '');
        if (!obj[key]) obj[key] = [];

        // if it's an indexed array e.g. colors[2]
        if (paramName.match(/\[\d+\]$/)) {
          // get the index value and add the entry at the appropriate position
          var index = /\[(\d+)\]/.exec(paramName)[1];
          obj[key][index] = paramValue;
        } else {
          // otherwise add the value to the end of the array
          obj[key].push(paramValue);
        }
      } else {
        // we're dealing with a string
        if (!obj[paramName]) {
          // if it doesn't exist, create property
          obj[paramName] = paramValue;
        } else if (obj[paramName] && typeof obj[paramName] === 'string'){
          // if property does exist and it's a string, convert it to an array
          obj[paramName] = [obj[paramName]];
          obj[paramName].push(paramValue);
        } else {
          // otherwise add the property
          obj[paramName].push(paramValue);
        }
      }
    }
  }

  return obj;
}

leagueID = getAllUrlParams().league;

function defaultReroute() {
  if (leagueID === undefined) {

    var url = window.location.href;    

    url += '?league=mlb'

    window.location.href = url;
      }
}

defaultReroute();


function App() {

  const [teams, setTeams] =  useState([]);
  const [teamsLoaded, setTeamsLoaded] = useState(false);
  const [homeTeamRoster, setHomeTeamRoster] = useState([]);
  const [awayTeamRoster, setAwayTeamRoster] = useState([]);
  const [gameDate, setGameDate] = useState();
  console.log(`Current League: ${leagueID}`);

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
      <h1>Biorhythm Sports Predicting</h1>
      

      {teamsLoaded ? (
          <Grid xs={12} container flexGrow={1} rowSpacing={2}>
            <Grid xs={14} flexGrow={1} lg={4} item>
              <ButtonGroup variant="contained" aria-label="outlined primary button group">
                  <Button href="/?league=mlb">MLB</Button>
                  <Button href="/?league=nfl">NFL</Button>
                  <Button href="/?league=nba">NBA</Button>
              </ButtonGroup>

            </Grid>
            <Grid xs={12} flexGrow={1} item>
              <GameSelector teams={teams} onSubmit={handleSubmit} />
            </Grid>
            <Grid xs={12} flexGrow={1} item>
              <h2>Away Team</h2>
              <br />
              <TeamRosterTable roster={homeTeamRoster} gameDate={gameDate} />
            </Grid>
            <Grid xs={12} flexGrow={1} item>
              <h2>Home Team</h2>
              <br />
              <TeamRosterTable roster={awayTeamRoster} gameDate={gameDate} />
            </Grid>
          </Grid>
      ) : (<p>Please wait, Loading the application...</p>)}
    </div>
  );
}



export default App;
