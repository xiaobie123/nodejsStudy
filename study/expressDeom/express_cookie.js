// express_cookie.js 文件
var express      = require('express')
var cookieParser = require('cookie-parser')
 
var app = express()
app.use(cookieParser())
 
app.get('/', function(req, res) {
  console.log("Cookies: ", req.cookies);
  res.send('Hello World');;
})
 
app.listen(8081)