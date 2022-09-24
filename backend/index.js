const Twitter = require('twitter-lite');
const axios = require('axios');
const language = require('@google-cloud/language');
const languageClient = new language.LanguageServiceClient();
const twitter_keys = require('./twitter_api_credentials.json');
const rapidAPI_keys = require('./rapid_api_credentials.json');
const user = new Twitter({
    consumer_key: twitter_keys.consumer_key,
    consumer_secret: twitter_keys.consumer_secret,
    access_token_key: twitter_keys.access_token_key,
    access_token_key_secret: twitter_keys.access_token_key_secret,
});
const express = require('express');
const express_app = express();
const PORT = 8080;

// searchForTweets("wutrain");
 
async function searchForTweets(screen_name) {
    try {
        let twitter_response = await user.getBearerToken();
        const twitter_app = new Twitter({
            bearer_token: twitter_response.access_token,
        });

        const num_tweets = 200;

        user_response = await twitter_app.get(`/users/lookup`, {
            screen_name: screen_name,
        })
        timeline_response = await twitter_app.get(`/statuses/user_timeline`, {
            screen_name: screen_name,
            lang: "en",
            count: num_tweets,
        })
        mention_response = await twitter_app.get(`/search/tweets`, {
            q: screen_name,
            lang: "en",
            count: num_tweets,
        });

        // Sentiment Search
        let allTweets = "";
        for (tweet of timeline_response) {
            allTweets += tweet.text + "\n";
        }
        const sentimentScores = await getSentimentScore(allTweets);
        
        // Sentiment Sort and discard, by Salience and not "OTHER"
        const max_entities = 10; // number of returned entities
        sentimentScores.sort((a,b) => (a.salience < b.salience) ? 1 : -1); // sort function with custom comparator
        const entitySentiments = sentimentScores.slice(0,max_entities);
        console.log(entitySentiments);
        // Botometer Search
        const twitter_data = {
            "user": user_response[0],
            "timeline": timeline_response,
            "mentions": mention_response.statuses,
        }
        
        // console.log(twitter_data);
        const botScore = await getBotScore(twitter_data);
        
        return { sentiments: entitySentiments, bot: botScore };
    } catch(e) {
        console.log("There was an error calling the Twitter or Google API");
        console.dir(e);
        if (e.errors[0].code == 17) {
            return  { sentiments: null, bot: null }
        }
    }
}

async function getSentimentScore(text) {
    const document = {
        content: text,
        type: 'PLAIN_TEXT',
    };

    // Detects the sentiment of the text
    const [nlp_result] = await languageClient.analyzeEntitySentiment({document: document});
    const entities = nlp_result.entities;

    return entities;
}

async function getBotScore(twitter_data) {
    const options = {
        method: 'POST',
        url: 'https://botometer-pro.p.rapidapi.com/4/check_account',
        headers: {
          'content-type': 'application/json',
          'X-RapidAPI-Key': rapidAPI_keys.x_rapid_api_key,
          'X-RapidAPI-Host': 'botometer-pro.p.rapidapi.com'
        },
        data: twitter_data
    };

    const botometer_result = await axios.request(options);
    return botometer_result.data;
}

express_app.use( express.json() )
// express_app.get('/tshirt', (req, res) => {
//     res.status(200).send({
//         tshirt: 'tf',
//         size: 'lg'
//     })
// });

express_app.post('/full', (req, res) => {
    const { screen_name } = req.body;
    console.log(`Recieved request for ${screen_name}`);

    if (!screen_name) {
         res.status(418).send({message:'Must provide a screen_name'})
    } else {
        searchForTweets(screen_name).then(result => {
            try {
                res.send({
                    msg: result
                })
            } catch(e) {
                console.dir(e);
            }
        })
    }
});

express_app.listen(PORT, () => {
    console.log(`twitterAPI: listening on port ${PORT}`);
    
  });