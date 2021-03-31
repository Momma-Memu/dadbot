const frameworkModule = require('webex-node-bot-framework');
const webhook = require('webex-node-bot-framework/webhook');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json())
app.use(express.static('images'));
const config = require('./config.json');
const { sendHelp, sendIssue, sendPR } = require('./utils/senders');
const { fetchIssue, fetchJokes, fetchPR, fetchQuote } = require('./utils/fetchers');
const { Dice, defaultDice } = require('./utils/skill');
const e = require('express');

const framework = new frameworkModule(config);
framework.start();
console.log(`Starting up....`);

framework.on("initialized", function(){
    console.log(`Hello, I'm dadbot, ready to send puns on port: ${config.port}`)
});

framework.on('spawn', (bot, id, actorId) => {
    if(actorId){
        let msg;
        bot.webex.people.get(actorId).then((user) => {
            msg = `Hi ${user.displayName}, I'm dadbot. You can say "help" to learn more about me.`;
        }).catch(e => {
            console.error('Failed to lookup user details in framework.on("spawn")');
            msg = `Hi hungry, I'm dadbot. You can say "help" to learn more about me.`
        }).finally(() => {
            if(bot.isDirect){
                bot.say('markdown', msg);
            } else {
                let botName = bot.person.displayName;
                msg += `\n\nDon't forget, in order for me to see your messages in this group space, be sure to *@mention* ${botName}.`;
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
    console.log(trigger)
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

framework.hears(/quote|qod|inspire me|(get me a|get) quote/i, async function(bot, trigger){
    const { q, a } = await fetchQuote();
    responded = true;
    bot.say("markdown", 
    `**Quote**: ${q} \n` +
    `**Author**:  ${a}\n` 
    );
})

framework.hears(/roll dice|dice/i, function(bot, trigger){
    const flags = trigger.text.split('=');
    responded = true;
    console.log(flags)
    if(flags.length < 3){
        const { throws } = defaultDice.roll(1);
        bot.say(`Feeling lucky? You rolled a ${throws}.`)
    } else {
        const sides = Number(flags[1].split(' ')[0]);
        const rolls = Number(flags[2]);

        if(sides > 100 || rolls > 100){
            bot.say(`Are you messing with me?`);
            return;
        }

        if(isNaN(sides) || isNaN(rolls)){
            bot.say(`Looks like you didn't type a correct roll number or number of sides, 
            if you need an example try this, "roll dice sides=20 rolls=2"`);
        } else {
            const customDice = new Dice(sides);
            const { throws, sum } = customDice.roll(rolls);
            bot.say(`Feeling lucky? You rolled ${throws.join(', ')}, and totaled ${sum}.`)
        }
    }
});

framework.hears(/(what's|whats) the meaning to life/i, function(bot, trigger){
    responded=true;
    bot.say('Go ask your mombot.')
});

framework.hears(/auto notify/, function (bot, trigger) {
    console.log('something important')
    responded = true;
    let msg;
    trigger.get(data).then((data) => {
        console.log(data)
        msg = `Hi ${data.repo} repo has a new pull request.`;
    }).catch(e => {
        msg = `Something went wrong but there's definitely a new pull request. For more information contact my creator
        on github, https://github.com/OnionQueenMemu`
    }).finally(() => {
        if(bot.isDirect){
            bot.say('markdown', msg);
        } else {
            message += `\n\nDon't forget, in order for me to see your messages in this group space, be sure to *@mention* me.`;
            bot.say('markdown', msg)
        };
    });

});

  


app.get('/', function (req, res) {
    res.send(`I'm alive.`);
});
  
app.post('/', webhook(framework));
  
const server = app.listen(config.port, function () {
    framework.debug('framework listening on port %s', config.port);
});

app.post('/pulls/notifications', function(req, res, next){
    const { name, owner, html_url } = req.body.repository;
    const userName = owner.login;
    console.log(req.body)
    
    const frameObject = {
        type: 'message',
        text: 'notification',
        args: ['notification'],
        data: {
            displayName: userName,
            repo: name,
            owner: owner,
            url: html_url
        },
        phrase: /auto notify/
    }

    req.body = frameObject;

    // res.send('okay')
    res.redirect(307, '/')
})

  
process.on('SIGINT', function () {
    framework.debug('stopping...');
    server.close();
    framework.stop().then(function () {
        process.exit();
    });
});