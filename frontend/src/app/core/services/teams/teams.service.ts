import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";

@Injectable()
export class TeamsService {

    constructor(
        private http: HttpClient,
    ) {
    }

    getPlayerInformation(teamID: string): Promise<any> {
        return this.http.get("http://localhost:3000/teams/" + teamID).toPromise();
    }
    
    // searchResults(text: string): Promise<any[]> {
    //     return this.http.get<any[]>("http://localhost:3000/search?q=" + text).toPromise();
    // }
}
