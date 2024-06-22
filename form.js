// const http = require('http');
// const fs = require('fs');
// const { parse } = require('querystring');
// const {newToken} = require("./token")

// global.DEBUG = true;

// const server = http.createServer((req,res)=>{
//     if(DEBUG) console.log('URL:',req.url);
//     let path = './views/';
//     switch(req.url){
//         case '/':
//             if (req.method==='POST'){
//                 requestDate(req, resu => {
//                     var theToken = newToken(resu.username);
//                     res.end(`
//                     <!doctype html>
//                     <html>
//                     <body>
//                     <style>
//                         body{
//                             text-align: center;
//                             background-color: burlywood;

//                         }
//                         input{
//                             background-color: aquamarine;
//                             margin-bottom: 10px;
//                             border-radius: 5px;
//                         }
//                         button{
//                             background-color: rebeccapurple;
//                             color: white;
//                             border-radius: 20px;
//                         }

//                          </style>

//                         <h2>${resu.username} token is ${theToken}</h2> <br />
//                         <a href="http://localhost:3000">New Token</a>
//                     </body>
//                     </html>
//                 `);
//                 })

//             }else{
//                 path += "newTokens.ejs";
//                 getFile(path);
//             }
//         break;
//         default:
//             console.log("404")
//             res.writeHead(404, { 'Content-Type': 'text/plain' });
//             res.end('404 Not Found');
//     }
//     function getFile(path) {
//         fs.readFile(path, function(error, data) {
//             if(error) {
//                 console.log(err);
//                 res.end();
//             } else {
//                 if(DEBUG) console.log('file was served.');
//                 res.writeHead(res.statusCode, {'Content-Type': 'text/html'});
//                 res.write(data);
//                 res.end();
//             }
//         })
//     };
// })

// server.listen(3000,()=>{
//     console.log("server on port 3000")
// })

// function requestDate(req, call) {
//     const FORM_URLENCODED = 'application/x-www-form-urlencoded';
//     if(req.headers['content-type'] === FORM_URLENCODED) {
//         let body = '';
//         req.on('data', chunk => {
//             body += chunk.toString();
//         });
//         req.on('end', () => {
//             call(parse(body));
//         });
//     }
//     else {
//         call(null);
//     }
// }
