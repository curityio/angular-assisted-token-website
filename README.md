# AssistedToken

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.0.0.

## Development server
Run `node server/server.js` for api server if required.

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Integrate with Angular App  
To integrate this example into any of Angular2/4 app, you need to copy `App Component` (`app.component.html`, `app.component.ts`) into your project and add this component into your App's module.    

The 2nd thing is to copy the `AuthInterceptor.ts` and `assistant.service.ts` files into your project and then add them into your Module providers as shown below.

```typescript
@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
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

You also need to add `HttpClientModule` in your Module imports as shown in above code.

The last thing is to configure environment variables like `issuer`, `clientId`, `apiUrl` and `authServerOrigin`.
You can see the following example environment config.

```typescript
export const environment = {
  production: false,
  issuer: "https://localhost:8443/~",
  clientId: "client-assisted-example",
  apiUrl: "http://127.0.0.1:8100",
  authServerOrigin: "http://127.0.0.1:8100"
};
```

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
