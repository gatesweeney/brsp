//Test Change


export default class SportsDataAccessor {

    #baseUri
    #league

    constructor() {
        this.#baseUri = 'https://api.sportsdata.io/v3/'
        this.#league = "mlb"
    }


    async getActiveTeams() {
        try {
            let response = await fetch(this.#buildUri('scores/json/teams'));
            let json = await response.json();
            return { success: true, data: json };
        } catch (error) {
            console.log(error);
            return { success: false };
        }
    }

    async getRoster(teamKey) {
        try {
            let response = await fetch(this.#buildUri(`scores/json/Players/${teamKey}`))
            let json = await response.json();
            return { success: true, data: json };
        } catch (error) {
            console.log(error);
            return { success: false };
        }
    }

    async getPlayer(PlayerID) {
        try {
            let response = await fetch(this.#buildUri(`scores/json/Player/${PlayerID}`))
            let json = await response.json();
            console.log(`Get team players response: ${json}`)
            return { success: true, data: json };
        } catch (error) {
            console.log(error);
            return { success: false };
        }
    }

    setLeague(league) {
        this.#league = league
    }

    #buildUri(path) {
        return `${this.#baseUri}${this.#league}/${path}?key=${this.#getKey()}`
    }

    #getKey() {
        switch (this.#league) {
            case "mlb": return '787b53b6ed4648dcbc5c12c2b96d9c40'
            case "nfl": return '1f19dedb48fa4c5993cb1f66fb686294'
            case "nba": return 'a8b21e680c5e44f09c3e9666a97b1701'
        }
    }

}