# Angular Assisted Token Example

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.0.0.

## Quick Start
In this example, an API call is made to an API using an access token received from a Curity server after authentication using the "assisted token flow". The client uses the Angular framework and shows how to use this development tool to perform the assisted token flow. For that, it calls a RESTful API that is hosted in a separate node server. To start both, simply invoke the following command:

```nodemon
npm start
```

Then, navigate to http://localhost:4200 in a web browser.  

You can make changes to the Angular single-page application (SPA) to perform your own experimentation. If you do, it the changes you make to the app's source files will automatically reload. If you change the API that the client invokes, you do not need to start the node API server. To do this, run `ng serve` instead of `npm start`. If you want to start only the API, you can do so with the command `node server/server.js`.
```nodemon
npm start
``` 

## Curity Configuration
In order to run this example you need to setup some configurations in Curity server. The easiest way is to [download and install the sample configuration](https://developer.curity.io/release/2.3.1/configuration-samples) from Curity developer portal. This sample configuration already has an authentication profile and an OAuth profile that can be used with this example. The OAuth profile also has a client app configured that can be used -- `client-assisted-example`. 
   
If you are not using the sample configuration, then you need to make sure the following configuration changes are made before you use this example.

1. Login into the Admin UI and make sure that you have uploaded a valid license under `System -> General`.
    ![image](./docs/images/license.png)
     
2. Go to OAuth profile and make sure that at least `Implicit Flow` and `Assisted Token` are enabled on the `General` page of that profile.
    ![image](./docs/images/client-capabilities.png)
    
3. Go to the `Apps` page of the profile and create a client called `client-assisted-example`. 
    ![image](./docs/images/oauth-apps.png)   

4. This client (accessible from `Token Service -> Apps -> Edit App -> client-assisted-example`) should have the `Implicit Flow` and `Assisted Token` options toggled on under the `Client Capabilities` section.
    ![image](./docs/images/oauth-app1.png)  
    
5. Update the `Redirect URIs` and `Allowed Origins` settings for the `client-assisted-example` OAuth App. The redirect URI should be `http://localhost:4200`. This is the URL where the Angular CLI will be hosting the SPA. The allowed origin should be the same or, for testing purposes, you can also use `*`.
    ![image](./docs/images/oauth-app2.png)   
       
6. Commit the changes, and you are all setup!

If you compare the final config with the sample config, then you will find the following salient differences.

```xml
<client-store>
    <config-backed>
        <client>
            <id>client-assisted-example</id>
            <redirect-uris>http://localhost:4200</redirect-uris>
            <allowed-origins>*</allowed-origins>
            <capabilities>
                <implicit/>
                <assisted-token/>
            </capabilities>
        </client>
        <!-- ... -->
    </config-backed>
</client-store>       
```

## Integrating with an Angular App  
To integrate this example into actual Angular2/4 app, you need to copy `App Component` (`app.component.html` and `app.component.ts`) into your project and add this component into your app's module. The second thing that is needed is to copy the `AuthInterceptor.ts` and `assistant.service.ts` files into your project and add them into your Module provider's as shown below.

```typescript
@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule
    ],
    providers: [
        AssistantService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true,
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
``` 

You also need to add `HttpClientModule` in your Module imports as shown in the above code.

The last thing required is to configure the environment variables like `issuer`, `clientId`, `apiUrl` and `authServerOrigin`. The following is an example of these environment configuration settings ()which are similar to those in `src/environments/*.ts`):  

```typescript
export const environment = {
  production: false,
  issuer: "https://localhost:8443/~",
  clientId: "client-assisted-example",
  apiUrl: "http://127.0.0.1:8100",
  authServerOrigin: "http://127.0.0.1:8100"
};
```

## Building the Sample

Run `ng build` to build the project. The build artifacts will be stored in the `dist` directory. Use the `-prod` flag to create a production build.

## More Help with Agnular CLI

To get more help on the Angular CLI, use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## More Information
For more information about Curity, its capabilities, and how to use it with Angular and other app development frameworks, visit [developer.curity.io](https://developer.curity.io/). For background information on using Curity for API access, consult the [API integration section of the Curity developer manual](https://support.curity.io/docs/2.0.2/developer-guide/api-integration/overview.html). For additional insights in how to use Curity with microservices and APIs from SPAs, read _[How to Control User Identity within Microservices](http://nordicapis.com/how-to-control-user-identity-within-microservices/)_ on the Nordic APIs blog. You may also be interested in validating tokens sent from the Angular front-end in a gateway like [Apigee](https://developer.curity.io/tutorials/apigee-integration) or [NGINX](https://github.com/curityio/nginx_phantom_token_module). 

## Licensing

This software is copyright (C) 2018 Curity AB. It is open source software that is licensed under the [Apache 2](LICENSE).
