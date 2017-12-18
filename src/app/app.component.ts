import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  window: any = window;
  settings = {
    clientId: "client-assisted-example",
    autoPrepareJqueryAjaxForOrigins: ['^/.*$']
  };
  isLoggedIn = false;
  tokenAssistant: any;

  constructor() {
  }

  ngOnInit() {
    if (!this.window.curity) {
      throw new Error("Assisted token javascript was not found." +
        " Make sure the server is running and/or update URL " +
        "of #assisted-token-js-script script");
    }
    this.tokenAssistant = this.window.curity.token.assistant(this.settings);
  }

  isAuthenticated() {
    return this.tokenAssistant.isAuthenticated();
  }

  getToken() {
    console.log("get token");
    this.tokenAssistant.loginIfRequired().then(function () {
      console.log("Tokens retrieved");
      console.log("Token " + this.tokenAssistant.getAuthHeader());

    }).fail(function (err) {
      console.log("Failed to retrieve tokens", err);
    });
  }
}
