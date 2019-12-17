import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { AssistantService } from '../services/assistant.service';
import { ParameterName } from '../types/constants';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
    userToken: string;
    isLoggedIn = false;
    apiResponse: any;

    constructor(private ref: ChangeDetectorRef,
                private assistantService: AssistantService,
                private http: HttpClient) {
    }

    ngOnInit() {
        this.isLoggedIn = this.assistantService.getParameterByName(ParameterName.USER) === 'true';
    }

    callApi() {
        const tokenAssistant = this.assistantService.getAssistant();
        if (tokenAssistant && Object.keys(tokenAssistant).length > 0) {
            const isUserAuthenticated = tokenAssistant.isAuthenticated() && !tokenAssistant.isExpired();
            if (isUserAuthenticated) {
                this.isLoggedIn = true;
                this.userToken = this.assistantService.getAssistant().getAuthHeader();
                this.http.get(environment.apiUrl + '/api').subscribe(
                  (response: any) => {
                      this.apiResponse = response.data;
                      this.ref.detectChanges();
                  },
                  errorResponse => {
                      this.apiResponse = errorResponse.error;
                      this.ref.detectChanges();
                  }
                );
            }
            else {
                tokenAssistant
                  .loginIfRequired()
                  .then(token => {
                      this.callApi();
                  })
                  .fail(err => {
                      console.log('Failed to retrieve tokens', err);
                  });
            }
        }
    }

    getToken() {
        const getTokenAssistant = this.assistantService.getAssistant();
        if (getTokenAssistant && Object.keys(getTokenAssistant).length > 0) {
            this.assistantService.getAssistant().loginIfRequired().then(() => {
                this.isLoggedIn = true;
                this.userToken = this.assistantService.getAssistant().getAuthHeader();
                if (this.assistantService.getParameterByName(ParameterName.USER) === 'false') {
                    const href = window.location.origin + '?user=true';
                    window.history.pushState({path: href}, '', href);
                }
                this.ref.detectChanges();

            }).fail((err) => {
                console.log('Failed to retrieve tokens', err);
            });
        }
    }

}
