import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { INVALID_REQUEST, LOGIN_REQUIRED, ParameterName } from '../types/constants';

@Injectable()
export class AssistantService {
  count: number = 0;
  tokenAssistant: any;
  window: any = window;
  private config: any;

  static self: AssistantService;

  constructor(private http: HttpClient) {
    AssistantService.self = this;
    this.loadConfiguration();
  }

  getAssistant() {
    return this.tokenAssistant;
  }

  loadConfiguration() {
    this.http.get(environment.issuer + environment.openIdConfigurationUrl)
      .subscribe(response => {
        this.config = response;
        this.addScriptToIndexFile();
        this.checkAuthorization();
        this.tryLoadTokenAssistant();
      });
  }

  tryLoadTokenAssistant() {
    if (this.window.curity) {
      if (!this.tokenAssistant) {
        this.loadTokenAssistant();
      }
    }
    else {
      setTimeout(() => {
        this.count++;
        if (this.count > 100) {
          return false;
        }
        this.tryLoadTokenAssistant();
      }, 20);
    }
  }

  addScriptToIndexFile() {
    const head = this.window.document.head;
    const script = this.window.document.createElement('script');
    script.type = 'text/javascript';
    script.src = this.config.assisted_token_endpoint + '/resources/js/assisted-token.min.js';
    script.id = 'assisted-token-js-script';
    head.appendChild(script);
  }

  loadTokenAssistant() {
    if (!this.window.curity) {
      throw new Error('Assisted token javascript was not found.' +
        ' Make sure the server is running and/or update URL ' +
        'of #assisted-token-js-script script');
    }
    this.tokenAssistant = this.window.curity.token.assistant({
      clientId: environment.clientId
    });
  }

  checkAuthorization() {
    const userParam = this.getParameterByName(ParameterName.USER);
    const errorParam = this.getParameterByName(ParameterName.ERROR);
    const idTokenParam = this.getParameterByName(ParameterName.ID_TOKEN);

    if (userParam) {
      return true;
    }
    else if (errorParam === LOGIN_REQUIRED || errorParam === INVALID_REQUEST) {
      const href = this.window.origin + '?user=false';
      window.history.pushState({path: href}, '', href);
    }
    else if (idTokenParam) {
      const href = this.window.origin + '?user=true';
      window.history.pushState({path: href}, '', href);
    }
    else {
      let nonceArray: any = window.crypto.getRandomValues(new Uint8Array(8));
      let nonce = '';
      for (let item in nonceArray) {
        if (nonceArray.hasOwnProperty(item)) {
          nonce += nonceArray[item].toString();
        }
      }
      this.window.location.href = this.config.authorization_endpoint + `?response_type=id_token&client_id=${environment.clientId}` +
        `&redirect_uri=${this.window.origin}&prompt=none&nonce=${nonce}`;
    }
  }

  getParameterByName(name) {
    const url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp('[?#&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
    if (!results) {
      return null;
    }
    if (!results[2]) {
      return '';
    }
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }
}
