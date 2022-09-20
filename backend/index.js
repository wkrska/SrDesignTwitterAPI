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

searchForTweets("wutrain");
 
async function searchForTweets(query) {
    try {
        let response = await user.getBearerToken();
        const app = new Twitter({
            bearer_token: response.access_token,
        });

        // // Tweet Search
        // response = await app.get(`/search/tweets`, {
        //     q: query,
        //     lang: "en",
        //     count: 5,
        // });

        response = await app.get(`/statuses/user_timeline`, {
            screen_name: query,
            lang: "en",
            count: 100,
        })

        // User Search

        // console.log(response);

        // // for search
        // let allTweets = "";
        // for (tweet of response.statuses) {
        //     allTweets += tweet.text + "\n";
        // }

        // for search
        let allTweets = "";
        for (tweet of response) {
            allTweets += tweet.text + "\n";
        }

        const sentimentScore = await getSentimentScore(allTweets);
        console.log(`The sentiment from user ${query} is: ${sentimentScore}`);

    } catch(e) {
        console.log("There was an error calling the Twitter API");
        console.dir(e);
    }
}

async function getSentimentScore(text) {
    const document = {
        content: text,
        type: 'PLAIN_TEXT',
    };

    // Detects the sentiment of the text
    const [result] = await languageClient.analyzeSentiment({document: document});
    const sentiment = result.documentSentiment;

    return sentiment.score;
}