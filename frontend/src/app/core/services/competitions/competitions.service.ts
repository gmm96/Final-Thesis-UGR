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

    getCompetitionTeamStats (competitionID, teamID) {
        return this.http.get("http://localhost:3000/competitions/" + competitionID + "/teams/" + teamID + "/stats").toPromise();
    }

    getCompetitionPlayerStats (competitionID, teamID, playerID) {
        return this.http.get("http://localhost:3000/competitions/" + competitionID + "/teams/" + teamID + "/players/" + playerID + "/stats").toPromise();
    }

    getNextTeamGamesInCompetition ( competitionID, teamID ) {
        return this.http.get("http://localhost:3000/competitions/" + competitionID + "/teams/" + teamID + "/next-games").toPromise();
    }

    getPrevTeamGamesInCompetition ( competitionID, teamID ) {
        return this.http.get("http://localhost:3000/competitions/" + competitionID + "/teams/" + teamID + "/prev-games").toPromise();
    }

    async createCompetition(competition: any): Promise<any> {
        let result = (await this.http.post("http://localhost:3000/competitions", competition).toPromise());
        return result;
    }
}
