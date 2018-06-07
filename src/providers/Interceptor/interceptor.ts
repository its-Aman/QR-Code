import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

/** Pass untouched request through to the next request handler. */
@Injectable()
export class NoopInterceptor implements HttpInterceptor {

    intercept(req: HttpRequest<any>, next: HttpHandler):
        Observable<HttpEvent<any>> {
        let newReq = req.clone({
            headers: req.headers.set('Authorization', "Bearer c38cd018f9487da66fee336d18ed3a1f")
        });

        console.log('NoopInterceptor', newReq);
        return next.handle(req);
    }
}