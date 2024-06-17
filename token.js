const fs = require('fs');
const crc32 = require('crc/crc32');
const myArgs = process.argv.slice(2);
const {format,add} = require("date-fns")


function tokenCount(){
    if(DEBUG)console.log("--count")
}

function newToken(username){
    if(DEBUG)console.log("--new")
        let newToken = JSON.parse(`{
            "created": "1969-01-31 12:30:00",
            "username": "username",
            "email": "user@example.com",
            "phone": "5556597890",
            "token": "token",
            "expires": "1969-02-03 12:30:00",
            "confirmed": "tbd"
        }`);
    let now = new Date()
    let expire = add(now,3)
    newToken.created =`${format(now,'dd-MM-yyyy ss:mm:HH')}`;
    newToken.username=username
    newToken.token = crc32(username).toString(8)
    newToken.created =`${format(expire,'dd-MM-yyyy ss:mm:HH')}`;
    
    fs.readFile(__dirname+'/json/tokens.json','utf-8',(error,data)=>{
        if(error) throw error;
        let tokens = JSON.parse(data);
        tokens.push(newToken);
        userTokens=JSON.stringify(tokens);

        fs.writeFile(__dirname+'/json/tokens.json',userTokens,(err)=>{
            if(err)console.log(err)
            else{
                console.log(`New token: ${newToken.token} was made`)
    }
        })
        
    })
    return newToken.token;
}

function upd(){
    if(DEBUG)console.log("--upd")
}
function search(){
    if(DEBUG)console.log("--search")
}




function tokenApp(){
    if(DEBUG)console.log("tokenApp()")
    switch(myArgs[1]){
    case '--count':
        tokenCount()
        break
    case '--new':
        if(myArgs.length<3){
            console.log("ERROR invalid syntax")
        }else{
           newToken(myArgs[2]) 
        }
        break
    case '--upd':
        upd()
        break
    case '--search':
        search()
        break
}
}

module.exports = {
    tokenApp,
  }