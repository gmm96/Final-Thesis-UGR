import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from "@angular/router";
import {environment} from "../../../environments/environment";

@Injectable()
export class AuthService {
    constructor(
        private http: HttpClient,
        private router: Router
    ) {
    }

    async login(params: LoginParams): Promise<boolean> {
        // now returns an Observable of Config
        let result =  (await this.http.post<Session>(environment.backendURL + "/login", params).toPromise())
        this.saveToken(result)
        return true
    }

    getMe(): Promise<Me> {
        return this.http.get<Me>(environment.backendURL + "/admin").toPromise()
    }

    getToken(): string {
        return localStorage.getItem('token')
    }

    isAuthenticated(): boolean {
        return this.getToken() != null
    }

    private saveToken(result) {
        localStorage.setItem('token', result.token)
    }

    logout() {
        localStorage.clear();
        this.router.navigate(['/login']);
    }

}

interface Me {
    first_name: string;
    last_name: string;
}

interface Session {
    token: string;
}

interface LoginParams {
    username: string;
    password: string;
}
