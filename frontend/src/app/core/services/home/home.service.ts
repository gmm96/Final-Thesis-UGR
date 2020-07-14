import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Home, SearchBoxResultInterface} from "./home";

@Injectable()
export class HomeService {

    constructor(
        private http: HttpClient,
    ) {
    }

    getPosts(): Promise<Home> {
        return this.http.get<Home>("http://reqres.in/api/users").toPromise()
    }

    async searchResults(text: string): Promise<any[]> {
        return await this.http.get<any[]>("http://localhost:3000/search?q=" + text).toPromise();
    }
}
