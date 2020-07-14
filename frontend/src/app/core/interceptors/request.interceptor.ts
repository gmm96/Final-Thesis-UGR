import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
    HttpResponse
} from "@angular/common/http";
import {Injector} from "@angular/core";
import {AuthService} from "../auth/auth.service";
import {Observable, throwError} from "rxjs";
import {catchError} from "rxjs/operators";
import {Router} from "@angular/router";


export class RequestInterceptor implements HttpInterceptor {

    constructor(
        private injector: Injector,
        private router: Router
    ) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const authService = this.injector.get(AuthService);

        req = req.clone(
            {
                setHeaders: this.getSessionHeaders(authService)
            }
        )

        return next.handle(req).pipe(
            catchError(
                (err: HttpErrorResponse) => {
                if (err.status == 401) {
                    authService.logout();
                } else if (err.status == 404) {
                    this.router.navigate(["/notFound"])
                }

                return throwError(err);

            })
        );
    }

    getSessionHeaders(authService: AuthService) {


        let token = authService.getToken()

        if (token) {
            return {
                Authorization: token,
                "Access-Control-Allow-Origin": "*",
                "Content-type": "application/json"
            }
        } else {
            return {
                "Access-Control-Allow-Origin": "*",
                "Content-type": "application/json"
            }
        }
    }
}
