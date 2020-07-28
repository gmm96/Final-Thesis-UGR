import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";

@Injectable()
export class PlayersService {

    constructor(
        private http: HttpClient,
    ) {
    }

    getPlayerInformation(playerID: string): Promise<any> {
        return this.http.get("http://localhost:3000/players/" + playerID).toPromise();
    }

    getPlayerArrayByPersonalIdentification(idCard: string): Promise<any> {
        return this.http.get("http://localhost:3000/players?q=" + idCard).toPromise();
    }

    async getPlayersWithoutTeam(idCard: string): Promise<any> {
        return (await this.http.get("http://localhost:3000/players/no-team?q=" + idCard).toPromise());
    }

    getPlayerCompetitions(playerID: string): Promise<any> {
        return (this.http.get("http://localhost:3000/players/" + playerID + "/competitions").toPromise());
    }

    async createPlayer(player: any, avatar?: File): Promise<any> {
        let formData = new FormData();

        for (const key of Object.keys(player)) {
            const value = player[key];
            formData.append(key, value);
        }
        if (avatar) formData.append("avatar", avatar);

        let result = (await this.http.post("http://localhost:3000/players", formData).toPromise());
        return result;
    }

    async editPlayer(playerID: string, player: any, avatar?: File): Promise<any> {
        let formData = new FormData();

        for (const key of Object.keys(player)) {
            const value = player[key];
            formData.append(key, value);
        }
        if (avatar) formData.append("avatar", avatar);

        let result = (await this.http.put("http://localhost:3000/players/" + playerID, formData).toPromise());
        return result;
    }

    async deletePlayer(playerID: string) {
        let result = (await this.http.delete("http://localhost:3000/players/" + playerID).toPromise());
        return result;
    }
}
