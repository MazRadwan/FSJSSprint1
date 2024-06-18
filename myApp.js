global.DEBUG = true;
const fs = require("fs");

const myArgs = process.argv.slice(2);

const {initApp} = require("./init.js")
const {configApp} = require("./config.js")
const {tokenApp} = require("./token.js")
const {searchApp} = require("./search.js")



if(DEBUG) if(myArgs.length >= 1) console.log('myArgs: ', myArgs);

switch(myArgs[0]){
    case 'init':
    case 'i':
        if(DEBUG) console.log("this is the init")
            initApp();
        break;
    case 'config':
    case 'c':
        if(DEBUG) console.log("this is the config")
            configApp()
        break;
    case 'token':
    case 't':
        if(DEBUG) console.log("this is the token")
            tokenApp()
        break;
    case 'help':
    case 'h':
    case 'search':
    case 's':
        if(DEBUG) console.log("this is the search")
            searchApp(myArgs.slice(1));
        break;
    default:
        if(DEBUG) console.log("this is the help") 
        fs.readFile(__dirname+"/help.txt",(error,data)=>{
            if(error)throw error;
            console.log(data.toString());
    })
        break;
}
