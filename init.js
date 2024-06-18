const fs = require("fs");
const fsPromise = require('fs').promises;
const path = require('path');



const myArgs = process.argv.slice(2);

const {folders,configjson,tokenjson} = require("./templates")

function makeFiles(){
    if(DEBUG)console.log("init.makeFiles")
        try{
            let configdata = JSON.stringify(configjson,null,2);
            let fileName = "./json/config.json"
            if(!fs.existsSync(path.join(__dirname,fileName))){
                    fs.writeFile(fileName, configdata, (err) => {
                    if(err) {
                        if (err.code == 'ENOENT') {
                            console.log('No file or directory, has the directory been created.');
                        }
                        else
                            console.log(err);
                    }
                    else {
                        console.log('Data written to config file.');
                    }
                })
            }else{
                console.log("file already exists")
            }
    }catch(err){
        if(err.code =='ENOENT')
            console.log("file already exists")
        else
            console.log(err)
    }
    try{
        let configdata = JSON.stringify(tokenjson,null,2);
        let fileName = "./json/tokens.json"
        if(!fs.existsSync(path.join(__dirname,fileName))){
                fs.writeFile(fileName, configdata, (err) => {
                if(err) {
                    if (err.code == 'ENOENT') {
                        console.log('No file or directory, has the directory been created.');
                    }
                    else
                        console.log(err);
                }
                else {
                    console.log('Data written to token file.');
                }
            })
        }else{
            console.log("file already exists")
        }
}catch(err){
    if(err.code =='ENOENT')
        console.log("file already exists")
    else
        console.log(err)
}

}

function makeFolders(){
    if(DEBUG)console.log("init.makeFolders")
    let mkcount = 0;
    folders.forEach(folder=>{
        if(DEBUG)console.log(folder)
        try{
            if(!fs.existsSync(path.join(__dirname,folder))){
                fsPromise.mkdir(path.join(__dirname,folder));
                mkcount++;
            }
        }
        catch(err){
            console.log(err);
        }
    });
    if(mkcount===0){
        console.log("All folders already exist")
    }else if(mkcount<=folders.length){
        console.log(mkcount+" folders made")
    }else{
        console.log("All folders have been made")
    }

}

function initApp(){
    if(DEBUG)console.log("initApp")
    switch(myArgs[1]){
        case '--all':
            if(DEBUG)console.log("make all")
            makeFolders()
            makeFiles()
            break;
        case '--cat':
            makeFiles()
            break
        case '--mk':
            makeFolders()
            break
        case 'help':
        case 'h':
        default:
            if(DEBUG) console.log("this is the help") 
                fs.readFile(__dirname+"/help.txt",(error,data)=>{
                    if(error)throw error;
                    console.log(data.toString());
            })
                break;
    }
}

module.exports={
    initApp,
}