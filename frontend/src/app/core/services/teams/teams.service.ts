import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {environment} from "../../../../environments/environment";

@Injectable()
export class TeamsService {

    constructor(
        private http: HttpClient,
    ) {
    }

    getTeamInformation(teamID: string): Promise<any> {
        return this.http.get(environment.backendURL + "/teams/" + teamID).toPromise();
    }

    getTeamArrayByName(name: string): Promise<any> {
        return this.http.get(environment.backendURL + "/teams?q=" + name).toPromise();
    }

    getTeamCompetitions(teamID: string): Promise<any> {
        return (this.http.get(environment.backendURL + "/teams/" + teamID + "/competitions").toPromise());
    }

    async createTeam(team: any, avatar?: File): Promise<any> {
        let formData = new FormData();

        for (const key of Object.keys(team)) {
            const value = (key != "players")? team[key] : JSON.stringify(team[key]);
            formData.append(key, value);
        }
        if (avatar) formData.append("avatar", avatar);

        let result = (await this.http.post(environment.backendURL + "/teams", formData).toPromise());
        return result;
    }

    async editTeam(teamID: string, team: any, avatar?: File): Promise<any> {
        let formData = new FormData();

        for (const key of Object.keys(team)) {
            const value = (key != "players") ? team[key] : JSON.stringify(team[key]);
            formData.append(key, value);
        }
        if (avatar) formData.append("avatar", avatar);

        let result = (await this.http.put(environment.backendURL + "/teams/" + teamID, formData).toPromise());
        return result;
    }

    async deleteTeam(teamID: string) {
        let result = (await this.http.delete(environment.backendURL + "/teams/" + teamID).toPromise());
        return result;
    }
}
