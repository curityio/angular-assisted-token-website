import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";

@Injectable()
export class AssistantService {
    count: number = 0;
    tokenAssistant: any;
    window: any = window;
    private config: any;
    private isLoggedIn: boolean;

    static self: AssistantService;

    constructor(private http: HttpClient) {
        AssistantService.self = this;
        this.loadConfiguration();
    }

    getAssistant() {
        return this.tokenAssistant;
    }

    loadConfiguration() {
        this.http.get(environment.issuer + "/.well-known/openid-configuration")
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