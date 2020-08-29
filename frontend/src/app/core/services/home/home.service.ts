import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Home, SearchBoxResultInterface} from "./home";
import {environment} from "../../../../environments/environment";

@Injectable()
export class HomeService {

    constructor(
        private http: HttpClient,
    ) {
    }

    async searchResults(text: string): Promise<any[]> {
        return await this.http.get<any[]>(environment.backendURL + "/search?q=" + text).toPromise();
    }
}
