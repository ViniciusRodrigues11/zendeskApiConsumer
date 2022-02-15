const axios = require('axios')
const { Parser } = require('json2csv')
const fs = require('fs');

let promises = []
let users = []


for (i = 1; i < 99; i++) {
    promises.push(axios.get(`https://grupoacx.zendesk.com/api/v2/users?page=${i}`, {
        auth: {
            username: '',
            password: ''
        }
    }))
}

Promise.all(promises).then(response => {
    for (i = 0; i < response.length; i++) {
        for (j = 0; j < response[i].data.users.length; j++) {
            users.push([response[i].data.users[j].name, response[i].data.users[j].id])
        }
    }

    const parser = new Parser();
    const csv = parser.parse(users);
    fs.writeFileSync('users.csv', csv);
})