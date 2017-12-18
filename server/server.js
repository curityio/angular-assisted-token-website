var http = require('http');
var url = require('url');

// Take the listening port as argument
var port = (process.argv.length > 2 ? process.argv[2] : 8100);

var handleApiRequest = function (request, response, apiHandler) {

  console.log("Serving API");

  // Employing very forgiving CORS, so this API-endpoint can be called from another origin;
  // E.g. when running multiple instances of this server that makes API-calls between each other.
  var responseHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Authorization'
  };

  // Making the naive assumption that any OPTIONS request is the user-agent making a cross-site preflighted request.
  if (request.method === 'OPTIONS') {
    console.log("Accepting probable preflight request");

    response.writeHead(200, responseHeaders);
    response.end();
    return;
  }

  var message;
  var status;

  var authorizeHeader = request.headers['authorization'];

  if (authorizeHeader !== undefined) {
    status = 200;
    var token = authorizeHeader.substring('Bearer '.length);
    message = apiHandler(token);
  } else {
    response.statusCode = 401;
    message = "No token included in API call";
    response.end("No token on request");
  }

  if (!response.finished) {
    console.log("handleApiRequest: Ending response");
  }
};

http.createServer(function (request, response) {

  console.log('request starting...');

  var pathname = url.parse(request.url, true).pathname;

  if (pathname === '/api') {
    handleApiRequest(request, response, function (token) {
      console.log("Token on request: " + token);

      response.end("API accessed with token " + token, 'utf-8');
    });
  } else {
    response.statusCode = 400;
    response.end("Request not allowed");
    return;
  }

}).listen(port);

console.log('Server running at http://127.0.0.1:%d/', port);
