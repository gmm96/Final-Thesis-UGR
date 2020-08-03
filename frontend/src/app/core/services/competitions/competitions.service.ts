import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";

@Injectable()
export class CompetitionsService {

    constructor(
        private http: HttpClient,
    ) {
    }

    getFullCompetitionInfo(competitionID: string): Promise<any> {
        return this.http.get("http://localhost:3000/competitions/" + competitionID).toPromise();
    }

    getCompetitionStandings(competitionID: string): Promise<any> {
        return this.http.get("http://localhost:3000/competitions/" + competitionID + "/league-table").toPromise();
    }

    getCurrentFixture(competitionID: string): Promise<any> {
        return this.http.get("http://localhost:3000/competitions/" + competitionID + "/current-fixture").toPromise();
    }

    getGameByCompetitionAndFixture(competitionID: string, fixture: number): Promise<any> {
        return this.http.get("http://localhost:3000/competitions/" + competitionID + "/fixture/" + fixture).toPromise();
    }

    getAllAvailablePlayoffsRoundsByCompetition(competitionID: string): Promise<any> {
        return this.http.get("http://localhost:3000/competitions/" + competitionID + "/all-playoffs/").toPromise();
    }

    getCompetitionTeamStats(competitionID, teamID) {
        return this.http.get("http://localhost:3000/competitions/" + competitionID + "/teams/" + teamID + "/stats").toPromise();
    }

    getCompetitionPlayerStats(competitionID, teamID, playerID) {
        return this.http.get("http://localhost:3000/competitions/" + competitionID + "/teams/" + teamID + "/players/" + playerID + "/stats").toPromise();
    }

    getNextTeamGamesInCompetition(competitionID, teamID) {
        return this.http.get("http://localhost:3000/competitions/" + competitionID + "/teams/" + teamID + "/next-games").toPromise();
    }

    getPrevTeamGamesInCompetition(competitionID, teamID) {
        return this.http.get("http://localhost:3000/competitions/" + competitionID + "/teams/" + teamID + "/prev-games").toPromise();
    }

    getUnplayedGamesByCompetition(competitionID: string) {
        return this.http.get("http://localhost:3000/competitions/" + competitionID + "/unplayed-games").toPromise();
    }

    getCompetitionListByName(name: string) {
        return this.http.get("http://localhost:3000/competitions?q=" + name).toPromise();
    }

    async createCompetition(competition: any): Promise<any> {
        let result = (await this.http.post("http://localhost:3000/competitions", competition).toPromise());
        return result;
    }

    async updateGameTimeAndLocation(competitionID: string, gameID, params): Promise<any> {
        let result = (await this.http.put("http://localhost:3000/competitions/" + competitionID + "/games/" + gameID, params).toPromise());
        return result;
    }

    getFullGameById(competitionID, gameID) {
        return this.http.get("http://localhost:3000/competitions/" + competitionID + "/games/" + gameID).toPromise();
    }

    async startGame(competitionID: string, gameID, initGame): Promise<any> {
        let result = (await this.http.post("http://localhost:3000/competitions/" + competitionID + "/games/" + gameID + "/start", initGame).toPromise());
        return result;
    }

    async createGameEvent(competitionID, gameID, event): Promise<any> {
        let result = (await this.http.post("http://localhost:3000/competitions/" + competitionID + "/games/" + gameID + "/events", event).toPromise());
        return result;
    }

    async removeGameEvent(competitionID, gameID, eventID): Promise<any> {
        let result = (await this.http.delete("http://localhost:3000/competitions/" + competitionID + "/games/" + gameID + "/events/" + eventID).toPromise());
        return result;
    }

}
