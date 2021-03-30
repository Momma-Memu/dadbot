const sendHelp = () => {
    bot.say("markdown", 'these are the commands I recognize: ', '\n\n ' +
    '1. **joke** (Need a pick me up? I got the dad jokes.) \n' +
    '2.  **pr** (I can get you the newest pull request from any repo)' 
    );
};


module.exports = sendHelp;