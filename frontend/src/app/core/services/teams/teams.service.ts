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
        let formData = new FormData()

        for (const key of Object.keys(team)) {
            const value = (key != "players") ? team[key] : JSON.stringify(team[key]);
            formData.append(key, value);
        }
        if (avatar) formData.append("avatar", avatar)
        debugger;
        // let result = (await this.http.post("http://localhost:3000/teams", formData).toPromise());
        // return result;
    }

    async editTeam(teamID: string, team: any, avatar?: File): Promise<any> {
        let formData = new FormData()

        for (const key of Object.keys(team)) {
            const value = (key != "players") ? team[key] : JSON.stringify(team[key]);
            formData.append(key, value);
        }
        if (avatar) formData.append("avatar", avatar);
        for (var pair of formData.entries()) {
            console.log(pair[0] + ', ' + pair[1]);
        }
        debugger;
        // let result = (await this.http.post("http://localhost:3000/teams", formData).toPromise());
        // return result;
    }


}
