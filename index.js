const frameworkModule = require('webex-node-bot-framework');
const webhook = require('webex-node-bot-framework/webhook');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json())
app.use(express.static('images'));
const config = require('./config.json');
const { sendHelp, sendIssue, sendPR } = require('./utils/senders');
const { fetchIssue, fetchJokes, fetchPR } = require('./utils/fetchers')

const framework = new frameworkModule(config);
framework.start();
console.log(`Starting up....`);

framework.on("initialized", function(){
    console.log(`Hello, I'm dadbot, ready to send puns on port: ${config.port}`)
});

framework.on('spawn', (bot, id, actorId) => {
    if(actorId){
        let message;
        bot.webex.people.get(actorId).then((user) => {
            message = `Hi ${user.displayName}, I'm dadbot. You can say "help" to learn more about me.`;
        }).catch(e => {
            console.error('Failed to lookup user details in framework.on("spawn")');
            message = `Hi hungry, I'm dadbot. You can say "help" to learn more about me.`
        }).finally(() => {
            if(bot.isDirect){
                bot.say('markdown', message);
            } else {
                let botName = bot.person.displayName;
                message += `\n\nDon't forget, in order for me to see your messages in this group space, be sure to *@mention* ${botName}.`;
                bot.say('markdown', msg)
            };
        });
    };
});

let responded = false;

// Message section:
framework.hears(/help|what can i (do|say)| what (can|do) you do/i, function(bot, trigger){
    console.log('Someone asked for my help, dad bot away!');
    responded = true;
    bot.say(`Hey there, ${trigger.person.displayName}.`)
    .then(() => sendHelp(bot)).catch(e => console.error(`Something went wrong in the help listener: ${e.message}`))
});

framework.hears(/(whats|what's) the newest (pull request|pr) |newest pr|pr/i, async function (bot, trigger){
    console.log('Gathering PR data from repo...');
    responded = true;
    const flags = trigger.text.split('=');
    if(flags.length < 3){
        bot.say('Looks like you did not provide a owner, or repo flag, ask for help to see an example.')
    } else {
        const owner = flags[1].split(' ')[0];
        const repo = flags[2];
        console.log(owner, repo)
        bot.say(`Gathering information from ${owner}'s ${repo} repo. One moment please...`)
        const data = await fetchPR(owner, repo, bot)
        if(data === null){
            bot.say('Looks like this repo has no pull requests at all.')
        } else {
            sendPR(bot, data)
        }
    }
})

framework.hears(/(whats|what's) the newest issue|newest issue|issue/i, async function(bot, trigger){
    console.log('Gathering issue data from repo...');
    responded = true;

    const flags = trigger.text.split('=');
    if(flags.length < 3){
        bot.say('Looks like you did not provide a owner, or repo flag, ask for help to see an example.')
    } else {
        const owner = flags[1].split(' ')[0];
        const repo = flags[2];
        console.log(owner, repo)
        bot.say(`Gathering information from ${owner}'s ${repo} repo. One moment please...`)
        const data = await fetchIssue(owner, repo, bot)
        // console.log(data)
        if(data === null){
            bot.say('Looks like this repo has no issues at all.')
        } else {
            sendIssue(bot, data)
        }
    }
});

framework.hears(/joke|jokes|tell me a joke/i, async function(bot, trigger) {
    const { joke } = await fetchJokes();
    responded = true;
    bot.say(joke)
});


app.get('/', function (req, res) {
    res.send(`I'm alive.`);
});
  
app.post('/', webhook(framework));
  
const server = app.listen(config.port, function () {
    framework.debug('framework listening on port %s', config.port);
});

app.post('/pulls/notifications', function(req, res, next){
    console.log(req.body)
})
  
process.on('SIGINT', function () {
    framework.debug('stopping...');
    server.close();
    framework.stop().then(function () {
        process.exit();
    });
});