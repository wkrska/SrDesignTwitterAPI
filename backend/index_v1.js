const express = require('express');
const app = express();
const PORT = 8080;
// const botometer = require('node-botometer-rapid-api'); // second library
const { Botometer } = require('botometer'); // third lib

// const B = new botometer({ // second lib
//   consumer_key: 'vnz7mCw3UqdzLBK8pTdTVXFuG',
//   consumer_secret: 't3AYWAYmBGKspb8CfEYbmAfaleqKHjSInKqBL4Gqhy0FRNj1Fx',
//   x_rapid_api_host: 'botometer-pro.p.rapidapi.com',
//   x_rapid_api_key: '95e7d46a06msh00ef1bb1b206673p18aaa0jsnf11a50a5439c',
//   app_only_auth: true,
//   rate_limit: 0,
//   log_progress: true,
//   include_user: true,
//   include_timeline: false,
//   include_mentions: false
// });

const B = new Botometer({ // third lib
    consumerKey: 'vnz7mCw3UqdzLBK8pTdTVXFuG',
    consumerSecret: 't3AYWAYmBGKspb8CfEYbmAfaleqKHjSInKqBL4Gqhy0FRNj1Fx',
    accessToken: '1568243060194291712-2myD2FbLL1zyRXGEzBg5v6frcdhOx2',
    accessTokenSecret: 'IA6bnj15hm8xKQVSd4BX2bPOWZw3IGWDVbM7OUqvTQc6k',
    rapidApiKey: '95e7d46a06msh00ef1bb1b206673p18aaa0jsnf11a50a5439c',
    supressLogs: false,
  });


app.use( express.json() )
app.get('/tshirt', (req, res) => {
    res.status(200).send({
        tshirt: 'tf',
        size: 'lg'
    })
});

app.post('/tshirt/:id', (req, res) => {
    const { id } = req.params;
    const { logo } = req.body;

    if (!logo) {
         res.status(418).send({message:'message lol'})
    }

    res.send({
        tshirt: `response of some sort logo ${logo} and id ${id}`
      })
});

app.listen(PORT, () => {
    console.log(`twitterAPI: listening on port ${PORT}`);
    // const names = ["wutrain"];

    // B.getBatchBotScores(names,data => {
    //     console.log(data);
    // });
  });

async function run() {
    const results = await B.getScores(["@wutrain"]);
 
    console.log(results);
}

run();