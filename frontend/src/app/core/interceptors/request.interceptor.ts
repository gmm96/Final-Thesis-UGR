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
import {ToastrService} from "ngx-toastr";


export class RequestInterceptor implements HttpInterceptor {

    constructor(
        private injector: Injector,
        private router: Router,
        private toastr: ToastrService,

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
                    this.toastr.clear();
                    this.toastr.error("Sesión caducada. Identifíquese de nuevo", "Error");
                } else if (err.status == 404) {
                    this.router.navigate(["/notFound"])
                }

                return throwError(err);

            })
        );
    }

    getSessionHeaders(authService: AuthService) {
        let headers = {
            "Access-Control-Allow-Origin": "*"
        }

        let token = authService.getToken()

        if (token) {
            headers['Authorization'] = token;
        }

        return headers;
    }
}
