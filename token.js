const fs = require('fs');
const crc32 = require('crc/crc32');
const myArgs = process.argv.slice(2);
const {format,add} = require("date-fns")
const {tokenTempl} = require("./templates")

function tokenCount(){
    if(DEBUG)console.log("--count")
        return new Promise(function(resolve,reject){
            fs.readFile(__dirname+'/json/tokens.json','utf-8',(err,data)=>{
                if(err)
                    reject(err)
                else{
                    let tokens = JSON.parse(data);
                    let count = Object.keys(tokens).length - 1
                    console.log(`The amount of tokens are: ${count}`)
                    resolve(count)
                }
            })
    })
}

function newToken(username){
    if(DEBUG)console.log("--new")
    let newToken = tokenTempl;
    JSON.stringify(tokenTempl)
    let now = new Date()
    let expire = add(now,3)
    newToken.created =`${format(now,'dd-MM-yyyy ss:mm:HH')}`;
    newToken.username=username
    newToken.token = crc32(username).toString(8)
    newToken.expires =`${format(expire,'dd-MM-yyyy ss:mm:HH')}`;
    
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

function updP(username,phone){
    if(DEBUG)console.log("--upd phone")
    upd(username,{phone:phone})
}
function updE(username,email){
    if(DEBUG)console.log("--upd email")
    upd(username,{email:email})
}

function upd(username,newData){
    if(DEBUG)console.log("upd()")
    fs.readFile(__dirname+'/json/tokens.json','utf-8',(error,data)=>{
        if(error) throw error;
        let tokens = JSON.parse(data);
        let user = tokens.find(u=>u.username===username)
        if(user){
            Object.assign(user,newData)
            fs.writeFile(__dirname+'/json/tokens.json',JSON.stringify(tokens,null,2),'utf-8',(err)=>{
                if(err) console.log(err)
                else{
            console.log(`user ${username} has benn updated with ${JSON.stringify(newData)}`)
            }
            })
        }else{
            console.log("a user with that username was not found")
        }
    })
}


function search(params){
    if(DEBUG) console.log("--search")
        fs.readFile(__dirname+'/json/tokens.json', (err, data) => {
            if (err) throw err;
            
            let users = JSON.parse(data);
            let query = params.join(' '); //Combine all arguments into a single query string
            
            //Filter the users based on the query
            let results = users.filter(user => 
                user.username.includes(query) || 
                user.email.includes(query) || 
                user.phone.includes(query)
            );
            
            console.log(results.length > 0 ? results : "No users found.");
        });
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
        if(myArgs.length<4){
            console.log("ERROR invalid syntax")
        }else{
            const[field, username, newValue] = [myArgs[2],myArgs[3],myArgs[4]]
            if(field === 'p'){
                updP(username,newValue)
            }
            else if(field === 'e'){
                updE(username,newValue)
            }else{
                console.log('ERROR unknown update field')
            }
        }
        break
    case '--search':
        search(myArgs.slice(2)) //This line was modified to include parameters
        break
}
}

module.exports = {
    tokenApp,
  }