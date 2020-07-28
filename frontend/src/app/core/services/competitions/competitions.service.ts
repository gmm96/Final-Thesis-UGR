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

    async createCompetition(competition: any): Promise<any> {
        let result = (await this.http.post("http://localhost:3000/competitions", competition).toPromise());
        return result;
    }

    // async deleteTeam(teamID: string) {
    //     let result = (await this.http.delete("http://localhost:3000/teams/" + teamID).toPromise());
    //     return result;
    // }
}
