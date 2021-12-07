import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CookiesStorageService, LocalStorageService, SessionStorageService, SharedStorageService } from "ngx-store";
import { Router } from '@angular/router';
import {
    RestApiService
} from '../app/rest-api.service';

@Injectable()
export class HttpTokenInterceptor implements HttpInterceptor {
    constructor(
        private restApiService: RestApiService,
        private sessionStore: SessionStorageService,
        private router: Router) { }

    redirect(to): void {
        this.router.navigate([to]);
    }
    loginExpiredNotifier(): void {
        this.restApiService.openSnackbar('Your login session expired. Please Re-login to continue');
    }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let token = this.sessionStore.get('token');
        if (token == undefined || token == null || token == "") {
            token = "noToken";
        }
        const authReq = req.clone({ headers: req.headers.set("token", token) });
        return next.handle(authReq).pipe(
            catchError((error, caught) => {
                if (error.status === 403 || error.status === 401) {
                    this.sessionStore.set('token', "noToken");
                    // this.loginExpiredNotifier();
                    this.router.navigate(['/login']);// remember to import router class and declare it in the class
                    return Observable.throw(error);
                } else {
                    return Observable.throw(error);
                }
            }) as any
        )
        
    }
}
