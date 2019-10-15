const SlackBot = require('slackbots');
const https = require('https');
const axios = require('axios');
require('dotenv').config();

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const bot = new SlackBot({
    token: process.env.TOKEN,
    name: 'jokebot'
})

// Start Handler
bot.on('start', () => {
    const params = {
        icon_emoji: ':smiley:'
    }

    bot.postMessageToChannel(
        'general',
        'Get Ready To Laugh With @Jokebot!',
        params
    )
})

// Error Handler
bot.on('error', (err) => console.log(err))

// Message Handler
bot.on('message', (data) => {
    if(data.type !== 'message') {
        return;
    }

    handleMessage(data.text);
})

// Respond to Data
function handleMessage(message) {
    if(message.includes(' chucknorris' || ' chuck norris')) {
        chuckJoke();
    } else if(message.includes(' yomama' || 'yo mama')) {
        yoMamaJoke();
    } else if(message.includes(' random')) {
        randomJoke();
    } else if(message.includes(' help')) {
        runHelp();
    }
}

//Tell a Chuck Norris Joke
function chuckJoke() {
    axios.get('http://api.icndb.com/jokes/random')
        .then(res => {
            const joke = res.data.value.joke;

            const params = {
                icon_emoji: ':laughing:'
            }

            bot.postMessageToChannel(
                'general',
                `Chuck Norris: ${joke}`, 
                params
            )
        }).catch(err => {
            console.log(err)
        })
}

// Tell a Yo Mama Joke
function yoMamaJoke() {
    const agent = new https.Agent({  
        rejectUnauthorized: false
    });
    axios.get('http://api.yomomma.info')
        .then(res => {
            const joke = res.data.joke;

            const params = {
                icon_emoji: ':laughing:'
            }

            bot.postMessageToChannel(
                'general',
                `Yo Mama: ${joke}`, 
                params
            )
        }).catch(err => {
            console.log(err)
        })
}

// Tell a Random Joke
function randomJoke() {
    const rand = Math.floor(Math.random() * 2) +1
    if(rand === 1){
        chuckJoke();
    } else if(rand === 2) {
        yoMamaJoke();
    }
}

// Show Help Text
function runHelp() {
    const params = {
        icon_emoji: ':question:'
    }

    bot.postMessageToChannel(
        'general',
        `Type @jokebot with either 'chucknorris', 'yomama', or 'random' to get a joke`, 
        params
    )
}