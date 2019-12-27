import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AssistantService } from './assistant.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor() {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (AssistantService.self && AssistantService.self.getAssistant() && environment.authServerOrigin === new URL(req.url).origin) {
      const authReq = req.clone({headers: req.headers.append('Authorization', AssistantService.self.getAssistant().getAuthHeader())});
      return next.handle(authReq);
    }
    return next.handle(req);
  }
}
