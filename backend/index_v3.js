const Twitter = require('twitter-api-v2');
const language = require('@google-cloud/language');
const languageClient = new language.LanguageServiceClient();
const user = new Twitter({
    version: "2",
    extension: false,
    consumer_key: 'vnz7mCw3UqdzLBK8pTdTVXFuG',
    consumer_secret: 't3AYWAYmBGKspb8CfEYbmAfaleqKHjSInKqBL4Gqhy0FRNj1Fx',
    access_token_key: '1568243060194291712-2myD2FbLL1zyRXGEzBg5v6frcdhOx2',
    access_token_key_secret: 'IA6bnj15hm8xKQVSd4BX2bPOWZw3IGWDVbM7OUqvTQc6k',
});

searchForTweets("lionel messi");

async function searchForTweets(query) {
    try {
        let response = await user.getBearerToken();
        const app = new Twitter({
            bearer_token: response.access_token,
        });

        // response = await app.get(`/search/tweets`, {
        response = await app.get(`2/tweets/search/recent`, {
            q: query,
            lang: "en",
            count: 100,
        });

        let allTweets = "";
        for (tweet of response.statuses) {
            allTweets += tweet.text + "\n";
        }

        const sentimentScore = await getSentimentScore(allTweets);
        console.log(`The sentiment about ${query} is: ${sentimentScore}`);

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