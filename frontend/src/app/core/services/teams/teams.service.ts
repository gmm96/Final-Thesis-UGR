import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";

@Injectable()
export class TeamsService {

    constructor(
        private http: HttpClient,
    ) {
    }

    getTeamInformation(teamID: string): Promise<any> {
        return this.http.get("http://localhost:3000/teams/" + teamID).toPromise();
    }

    getTeamArrayByName(name: string): Promise<any> {
        return this.http.get("http://localhost:3000/teams?q=" + name).toPromise();
    }

    async createTeam(team: any, avatar?: File): Promise<any> {
        let formData = new FormData();

        for (const key of Object.keys(team)) {
            const value = (key != "players")? team[key] : JSON.stringify(team[key]);
            formData.append(key, value);
        }
        if (avatar) formData.append("avatar", avatar);

        let result = (await this.http.post("http://localhost:3000/teams", formData).toPromise());
        return result;
    }

    async editTeam(teamID: string, team: any, avatar?: File): Promise<any> {
        let formData = new FormData();

        for (const key of Object.keys(team)) {
            const value = (key != "players") ? team[key] : JSON.stringify(team[key]);
            formData.append(key, value);
        }
        if (avatar) formData.append("avatar", avatar);

        let result = (await this.http.put("http://localhost:3000/teams/" + teamID, formData).toPromise());
        return result;
    }

    async deleteTeam(teamID: string) {
        let result = (await this.http.delete("http://localhost:3000/teams/" + teamID).toPromise());
        return result;
    }
}
