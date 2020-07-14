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

    // searchResults(text: string): Promise<any[]> {
    //     return this.http.get<any[]>("http://localhost:3000/search?q=" + text).toPromise();
    // }
}
