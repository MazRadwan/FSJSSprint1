const fs = require('fs');
const path = require('path');

const myArgs = process.argv.slice(2);

const configFilePath = path.join(__dirname, 'json', 'config.json');

//Finds file path
function getConfig() {
    if (fs.existsSync(configFilePath)) {
        const configFile = fs.readFileSync(configFilePath);
        return JSON.parse(configFile);
    } else {
        return null;
    }
}

function setConfig(config) {
    fs.writeFileSync(configFilePath, JSON.stringify(config, null, 2));
}

//All of the commands
function configApp() {
    const command = myArgs[1];
    let config;  //Declare config here

    switch (command) {
        case '--show':  //Show the configuration settings
            config = getConfig();  // Assign to config here
            if (config) {
                console.log(config);
            } else {
                console.log('Config file not found.');
            }
            break;
        case '--reset':   //Reset the configuration settings
            setConfig(defaultConfig);
            console.log('Config has been reset to default.');
            break;
        case '--set':    //Set the configuration settings
            const key = myArgs[2];
            const value = myArgs[3];
            config = getConfig() || defaultConfig;  // Assign to config here
            config[key] = value;
            setConfig(config);
            console.log(`Set ${key} to ${value} in config.`);
            break;
        default:
            console.log('Invalid config command.');
            break;
    }
}

module.exports = {
    initApp,
    configApp,
};
