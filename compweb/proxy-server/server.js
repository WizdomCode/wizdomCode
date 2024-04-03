var express = require('express');
var { createProxyMiddleware } = require('http-proxy-middleware');

var app = express();

app.use('/', createProxyMiddleware({ 
    target: 'http://localhost:9000', // this is your Python server address
    changeOrigin: true,
    pathRewrite: {
        '^/': '/', // rewrite path
    },
}));

app.listen(3001, function () {
  console.log('Proxy server listening on port 3001');
});
