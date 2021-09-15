import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {environment} from "../../../../environments/environment";

@Injectable()
export class PlayersService {

    constructor(
        private http: HttpClient,
    ) {
    }

    getPlayerInformation(playerID: string): Promise<any> {
        return this.http.get(environment.backendURL + "/players/" + playerID).toPromise();
    }

    getPlayerArrayByPersonalIdentification(idCard: string): Promise<any> {
        return this.http.get(environment.backendURL + "/players?q=" + idCard).toPromise();
    }

    async getPlayersWithoutTeam(idCard: string): Promise<any> {
        return (await this.http.get(environment.backendURL + "/players/no-team?q=" + idCard).toPromise());
    }

    getPlayerCompetitions(playerID: string): Promise<any> {
        return (this.http.get(environment.backendURL + "/players/" + playerID + "/competitions").toPromise());
    }

    getAverageCompetitionPlayerStats(playerID: string): Promise<any> {
        return (this.http.get(environment.backendURL + "/players/" + playerID + "/stats").toPromise());
    }

    async createPlayer(player: any, avatar?: File): Promise<any> {
        let formData = new FormData();

        for (const key of Object.keys(player)) {
            const value = player[key];
            formData.append(key, value);
        }
        if (avatar) formData.append("avatar", avatar);

        let result = (await this.http.post(environment.backendURL + "/players", formData).toPromise());
        return result;
    }

    async editPlayer(playerID: string, player: any, avatar?: File): Promise<any> {
        let formData = new FormData();

        for (const key of Object.keys(player)) {
            const value = player[key];
            formData.append(key, value);
        }
        if (avatar) formData.append("avatar", avatar);

        let result = (await this.http.put(environment.backendURL + "/players/" + playerID, formData).toPromise());
        return result;
    }

    async deletePlayer(playerID: string) {
        let result = (await this.http.delete(environment.backendURL + "/players/" + playerID).toPromise());
        return result;
    }
}
