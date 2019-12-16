import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {AssistantService} from "../services/assistant.service";

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
        this.isLoggedIn = this.assistantService.getParameterByName("user") === "true";
    }

	callApi() {
		const getTokenAssistant = this.assistantService.getAssistant();
		if (getTokenAssistant && Object.keys(getTokenAssistant).length > 0) {
			const isUserAuthenticated =
				getTokenAssistant.isAuthenticated() && !getTokenAssistant.isExpired();
			if (isUserAuthenticated) {
				this.isLoggedIn = true;
				this.userToken = this.assistantService.getAssistant().getAuthHeader();
				this.http.get(environment.apiUrl + "/api").subscribe(
					(response: any) => {
						this.apiResponse = response.data;
						this.ref.detectChanges();
					},
					errorResponse => {
						this.apiResponse = errorResponse.error;
						this.ref.detectChanges();
					}
				);
			} else {
				getTokenAssistant
					.loginIfRequired()
					.then(token => {
						this.callApi();
					})
					.fail(err => {
						console.log("Failed to retrieve tokens", err);
					});
			}
		}
	}

	getToken() {
		const getTokenAssistant = this.assistantService.getAssistant();
		if (getTokenAssistant && Object.keys(getTokenAssistant).length > 0) {
			this.assistantService.getAssistant().loginIfRequired().then(() => {
				this.isLoggedIn = true;
				console.log('Tokens retrieved');
				this.userToken = this.assistantService.getAssistant().getAuthHeader();
				if (this.assistantService.getParameterByName('user') === 'false') {
					const userIsLoggedIn = window.location.origin + '?user=true';
					window.history.pushState({path: userIsLoggedIn}, '', userIsLoggedIn);
				}
				console.log('Token ' + this.userToken);
				this.ref.detectChanges();

			}).fail((err) => {
				console.log('Failed to retrieve tokens', err);
			});
		}
	}

}
