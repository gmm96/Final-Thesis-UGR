import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {environment} from "../../../../environments/environment";

@Injectable()
export class CompetitionsService {

    constructor(
        private http: HttpClient,
    ) {
    }

    getFullCompetitionInfo(competitionID: string): Promise<any> {
        return this.http.get(environment.backendURL + "/competitions/" + competitionID).toPromise();
    }

    getCompetitionStandings(competitionID: string): Promise<any> {
        return this.http.get(environment.backendURL + "/competitions/" + competitionID + "/league-table").toPromise();
    }

    getCurrentFixture(competitionID: string): Promise<any> {
        return this.http.get(environment.backendURL + "/competitions/" + competitionID + "/current-fixture").toPromise();
    }

    getGameByCompetitionAndFixture(competitionID: string, fixture: number): Promise<any> {
        return this.http.get(environment.backendURL + "/competitions/" + competitionID + "/fixture/" + fixture).toPromise();
    }

    getAllAvailablePlayoffsRoundsByCompetition(competitionID: string): Promise<any> {
        return this.http.get(environment.backendURL + "/competitions/" + competitionID + "/all-playoffs/").toPromise();
    }

    getCompetitionTeamStats(competitionID, teamID) {
        return this.http.get(environment.backendURL + "/competitions/" + competitionID + "/teams/" + teamID + "/stats").toPromise();
    }

    getCompetitionPlayerStats(competitionID, teamID, playerID) {
        return this.http.get(environment.backendURL + "/competitions/" + competitionID + "/teams/" + teamID + "/players/" + playerID + "/stats").toPromise();
    }

    getNextTeamGamesInCompetition(competitionID, teamID) {
        return this.http.get(environment.backendURL + "/competitions/" + competitionID + "/teams/" + teamID + "/next-games").toPromise();
    }

    getPrevTeamGamesInCompetition(competitionID, teamID) {
        return this.http.get(environment.backendURL + "/competitions/" + competitionID + "/teams/" + teamID + "/prev-games").toPromise();
    }

    getUnplayedGamesByCompetition(competitionID: string) {
        return this.http.get(environment.backendURL + "/competitions/" + competitionID + "/unplayed-games").toPromise();
    }

    getCompetitionListByName(name: string) {
        return this.http.get(environment.backendURL + "/competitions?q=" + name).toPromise();
    }

    async createCompetition(competition: any): Promise<any> {
        let result = (await this.http.post(environment.backendURL + "/competitions", competition).toPromise());
        return result;
    }

    async updateGameTimeAndLocation(competitionID: string, gameID, params): Promise<any> {
        let result = (await this.http.put(environment.backendURL + "/competitions/" + competitionID + "/games/" + gameID, params).toPromise());
        return result;
    }

    getFullGameById(competitionID, gameID) {
        return this.http.get(environment.backendURL + "/competitions/" + competitionID + "/games/" + gameID).toPromise();
    }

    async startGame(competitionID: string, gameID, initGame): Promise<any> {
        let result = (await this.http.post(environment.backendURL + "/competitions/" + competitionID + "/games/" + gameID + "/start", initGame).toPromise());
        return result;
    }

    async createGameEvent(competitionID, gameID, event): Promise<any> {
        let result = (await this.http.post(environment.backendURL + "/competitions/" + competitionID + "/games/" + gameID + "/events", event).toPromise());
        return result;
    }

    async removeGameEvent(competitionID, gameID, eventID): Promise<any> {
        let result = (await this.http.delete(environment.backendURL + "/competitions/" + competitionID + "/games/" + gameID + "/events/" + eventID).toPromise());
        return result;
    }

}
