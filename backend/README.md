This backend requires node.js, as well as several npm packages
- twitter-lite
- axios
- @google-cloud/language
- express

Additionally, you will need a twitter developer account, a twitter application, and accompanying keys.
You will need a google cloud account, a project in it, and create a service account for that project. Copy the json keys into the example.

The API responds with the following format
{
    msg: {
        sentiments: [object(entity)](https://cloud.google.com/natural-language/docs/reference/rest/v1beta2/Entity),
        bot: [object(BotometerResponse)](https://rapidapi.com/OSoMe/api/botometer-pro/details),
    }
}
