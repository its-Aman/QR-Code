import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

/** Pass untouched request through to the next request handler. */
@Injectable()
export class NoopInterceptor implements HttpInterceptor {

    intercept(req: HttpRequest<any>, next: HttpHandler):
        Observable<HttpEvent<any>> {
        let newReq = req.clone({
            headers: req.headers.set('Authorization', "Bearer 52ddd8544e32011dc757c5e4550c318a")
        });

        console.log('NoopInterceptor', newReq);
        return next.handle(req);
    }
}