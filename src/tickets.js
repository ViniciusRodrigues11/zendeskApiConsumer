const axios = require('axios')
const { Parser } = require('json2csv')
const fs = require('fs');

let promises = []
let tickets = []

var i = 1;
var count = 1;

const pages = [[1, 150], [151, 300], [301, 450], [451, 550]]
//const pages = [[0, 15], [16, 30]]

function myLoop() {
    setTimeout(function () {
        console.log(pages[count-1])
        for (page = pages[count - 1][0]; page < pages[count - 1][1]; page++) {
            promises.push(axios.get(`https://grupoacx.zendesk.com/api/v2/tickets?page=${page}`, {
                auth: {
                    username: '',
                    password: ''
                }
            }))
        }

        Promise.all(promises).then(response => {
            for (i = 0; i < response.length; i++) {
                for (j = 0; j < response[i].data.tickets.length; j++) {
                    if (response[i].data.tickets[j].group_id === 360008552432) {
                        tickets.push([response[i].data.tickets[j].id, response[i].data.tickets[j].requester_id, response[i].data.tickets[j].created_at, JSON.stringify(response[i].data.tickets[j].description).slice(1, -1)])
                    }
                }
            }
            console.log(tickets.length)

            if (count === 5) {
                const parser = new Parser();
                const csv = parser.parse(tickets);
                fs.writeFileSync('tickets.csv', csv);
            }
        })

        count++;
        if (count <= 4) {
            myLoop();
        }
    }, count === 1 ? 0 : 30000)
}

myLoop();




