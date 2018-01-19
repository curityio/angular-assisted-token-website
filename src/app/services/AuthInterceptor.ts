import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from "rxjs/Observable";
import {environment} from "../../environments/environment";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor() {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (localStorage.getItem("token") && environment.authServerOrigin === new URL(req.url).origin) {
            const authReq = req.clone({headers: req.headers.append('Authorization', localStorage.getItem("token"))});
            return next.handle(authReq);
        }
        return next.handle(req);
    }
}