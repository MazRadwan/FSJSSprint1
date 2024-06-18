const fs = require('fs');

exports.searchApp = function(params) {
    //Assuming you have a JSON file with user records
    fs.readFile('./users.json', (err, data) => {
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
