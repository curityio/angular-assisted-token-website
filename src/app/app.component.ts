import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Http} from "@angular/http";
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


  constructor(private ref: ChangeDetectorRef,
              private http: Http) {
  }

  ngOnInit() {
    this.loadConfiguration();
  }

  isAuthenticated() {
    this.tokenAssistant.isAuthenticated();
  }

  getToken() {
    this.tryLoadTokenAssistant();
    this.tokenAssistant.loginIfRequired().then(() => {
      console.log("Tokens retrieved");
      this.userToken = this.tokenAssistant.getAuthHeader();
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
    this.http.get(this.config.authorization_endpoint + `?response_type=id_token&client_id=${environment.clientId}` +
      `&redirect_uri=${this.window.origin}&prompt=none`)
      .subscribe(response => {
        console.log(response);
      });
  }

}
