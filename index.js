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
bot.on('error', (err) => { 
    console.log(err); 
})

// Message Handler
bot.on('message', (data) => {
    if(data.type == 'desktop_notification') {
        console.log(data.type);
        console.log(data)
        return "This is not of type message";
    }
    console.log("TEST!")

    handleMessage(data.text);
    // res.sendStatus(200)
})

// Respond to Data
function handleMessage(message) {
    let cnRegex = new RegExp("(?!')(chuck norris)(?!')|(?!')(chucknorris)(?!')");
    let ymRegex = new RegExp("(?!')(yo mama)(?!')|(?!')(yomama)(?!')");
    let randomRegex = new RegExp("(?!')(random)(?!')");
    let helpRegex = new RegExp("(?!')(help)(?!')");
    console.log(message);
    // switch(message) {
    //     case "chucknorris":
    //         chuckJoke();
    //         console.log("Hit Chuck Norris");
    //         break;
    //     case "yomama":
    //         yoMamaJoke();
    //         console.log("Hit Yo Mama");
    //         break;
    //     case "help":
    //         runHelp();
    //         console.log("Hit Help");
    //         break;
    //     case "random":
    //         randomJoke();
    //         console.log("Hit Random");
    //         break;
    //     default:
    //         // console.log(message)
    //         return;
    // }
    if(message.match(helpRegex)) {
        runHelp();
        console.log("help running!")
    } else if(message.match(ymRegex)) {
        yoMamaJoke();
        console.log("Yo Mama running!!!")
    } else if(message.match(cnRegex)) {
        chuckJoke();
        console.log("Chuck Norris running!!!")
    } else if(message.match(randomRegex)) {
        randomJoke();
        console.log("random is running!")
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

    const helpMessage = `Type *@jokebot* with either *chucknorris* or *chuck norris* for a Chuck Norris joke"\n
Type @jokebot with either *yomama* or *yo mama* for a Yo Momma joke"\n
Type *random* to get a random joke`

    bot.postMessageToChannel(
        'general',
        `${helpMessage}`, 
        params
    );
}