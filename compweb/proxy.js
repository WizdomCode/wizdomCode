const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

app.use('/api', createProxyMiddleware({ 
  target: 'https://emkc.org', // This is the server you want to proxy requests to
  changeOrigin: true, // This ensures that the origin of the request is always the proxy server
}));

app.listen(3001); // You can choose any port number here
