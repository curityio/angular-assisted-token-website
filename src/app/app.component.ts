import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Headers, Http, RequestOptions} from "@angular/http";
import {environment} from "../environments/environment";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  window: any = window;
  tokenAssistant: any;
  userToken: string;
  config: any;
  count = 0;
  isLoggedIn = false;
  apiResponse: any;


  constructor(private ref: ChangeDetectorRef,
              private http: Http) {
  }

  ngOnInit() {
    this.loadConfiguration();
  }


  callApi() {
    this.tryLoadTokenAssistant();
    this.tokenAssistant.loginIfRequired().then(() => {
      this.userToken = this.tokenAssistant.getAuthHeader();
      const headers: Headers = new Headers({'Content-Type': 'application/json'});
      headers.append('Authorization', this.userToken);
      const options = new RequestOptions({headers: headers});
      this.http.get(environment.serverUrl + "/api", options)
        .subscribe(response => {
          this.apiResponse = response.text();
          this.ref.detectChanges();
        });
    }).fail((err) => {
      console.log("Failed to retrieve tokens", err);
    });
  }

  getToken() {
    this.tryLoadTokenAssistant();
    this.tokenAssistant.loginIfRequired().then(() => {
      console.log("Tokens retrieved");
      this.userToken = this.tokenAssistant.getAuthHeader();
      if (this.getParameterByName("user") === "false") {
        window.location.search = "?user=true";
      }
      console.log("Token " + this.userToken);
      this.ref.detectChanges();

    }).fail((err) => {
      console.log("Failed to retrieve tokens", err);
    });
  }

  loadConfiguration() {
    this.http.get(environment.issuer + "/.well-known/openid-configuration")
      .subscribe(response => {
        response = response.json();
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
    } else {
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
    const script = this.window.document.createElement("script");
    script.type = 'text/javascript';
    script.src = this.config.assisted_token_endpoint + "/resources/js/assisted-token.min.js";
    script.id = "assisted-token-js-script";
    head.appendChild(script);
  }

  loadTokenAssistant() {
    if (!this.window.curity) {
      throw new Error("Assisted token javascript was not found." +
        " Make sure the server is running and/or update URL " +
        "of #assisted-token-js-script script");
    }
    this.tokenAssistant = this.window.curity.token.assistant({
      clientId: environment.clientId
    });
  }

  checkAuthorization() {
    if (this.getParameterByName("user")) {
      this.isLoggedIn = this.getParameterByName("user") === "true";
      return true;
    } else if (this.getParameterByName("error") === "login_required") {
      this.window.location.href = this.window.origin + "?user=false";
    } else if (this.getParameterByName("error")) {
      this.window.location.href = this.window.origin + "?user=true";
    } else {
      const url = this.config.authorization_endpoint + `?response_type=id_token&client_id=${environment.clientId}` +
        `&redirect_uri=${this.window.origin}&prompt=none`;
      this.window.location.href = url;
    }
  }

  getParameterByName(name) {
    const url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
    if (!results) {
      return null;
    }
    if (!results[2]) {
      return '';
    }
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }


}
