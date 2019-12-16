// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  issuer: "https://localhost:8443/",
  clientId: "client-assisted-example",
  apiUrl: "http://127.0.0.1:8100",
  authServerOrigin: "http://127.0.0.1:8100",
  openid_configuration_url: "dev/oauth/anonymous/.well-known/openid-configuration"
};

export const authorization_parameters_by = {
  user: 'user',
  error: 'error',
  id_token: 'id_token',
};

export const constants = {
  login_required: 'login_required',
  invalid_request: 'invalid_request'
};
