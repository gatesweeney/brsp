
export default class SportsDataAccessor {

    #baseUri
    #key

    constructor() {
        this.#baseUri = 'https://api.sportsdata.io/v3/'
        this.#key = '787b53b6ed4648dcbc5c12c2b96d9c40' // TODO: move to env
    }


    async getActiveTeams() {
        try {
            let response = await fetch(this.#buildUri('mlb/scores/json/teams'));
            let json = await response.json();
            console.log(`Get active teams response: ${json}`)
            return { success: true, data: json };
        } catch (error) {
            console.log(error);
            return { success: false };
        }
    }

    async getRoster(teamKey) {
        try {
            let response = await fetch(this.#buildUri(`mlb/scores/json/Players/${teamKey}`))
            let json = await response.json();
            console.log(`Get team players response: ${json}`)
            return { success: true, data: json };
        } catch (error) {
            console.log(error);
            return { success: false };
        }
    }

    #buildUri(path) {
        return `${this.#baseUri}${path}?key=${this.#key}`
    }

}