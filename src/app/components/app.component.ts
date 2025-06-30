import {HttpClient} from '@angular/common/http';
import {Component, OnInit, signal} from '@angular/core';
import {environment} from '../../environments/environment';
import {AssistantService} from '../services/assistant.service';
import {ParameterName} from '../types/constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false
})
export class AppComponent implements OnInit {
  userToken = signal('');
  isLoggedIn = signal(false);
  apiResponse = signal(null);

  constructor(
    private assistantService: AssistantService,
    private http: HttpClient) {
  }

  ngOnInit(): void {
    this.isLoggedIn.set(this.assistantService.getParameterByName(ParameterName.USER) === 'true');
  }

  callApi(): void {
    const tokenAssistant = this.assistantService.getAssistant();
    if (tokenAssistant && Object.keys(tokenAssistant).length > 0) {
      const isUserAuthenticated = tokenAssistant.isAuthenticated() && !tokenAssistant.isExpired();
      if (isUserAuthenticated) {
        this.isLoggedIn.set(true);
        this.userToken.set(tokenAssistant.getAuthHeader());

        this.http.get(environment.apiUrl + '/api').subscribe({
          next: (response: any) => {
            this.apiResponse.set(response.data);
          },
          error: (errorResponse) => {
            this.apiResponse.set(errorResponse.error);
          }
        });
      } else {
        tokenAssistant.loginIfRequired()
          .then(() => this.callApi())
          .catch(err => console.log('Failed to retrieve tokens when calling API', err));
      }
    }
  }

  getToken(): void {
    const tokenAssistant = this.assistantService.getAssistant();

    if (tokenAssistant && Object.keys(tokenAssistant).length > 0) {
      tokenAssistant.loginIfRequired()
        .then(() => {
          this.isLoggedIn.set(true);
          this.userToken.set(tokenAssistant.getAuthHeader());

          if (this.assistantService.getParameterByName(ParameterName.USER) === 'false') {
            const href = `${window.location.origin}?user=true`;
            window.history.pushState({path: href}, '', href);
          }
        })
        .catch(err => console.log('Failed to retrieve tokens during getToken', err));
    }
  }
}
