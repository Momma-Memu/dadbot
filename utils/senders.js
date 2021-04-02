const sendHelp = (bot) => {
    bot.say("markdown", 'these are the commands I recognize: ', '\n\n ' +
    '1. **joke** (Need a pick me up? I got the dad jokes.) \n' +
    '2.  **pr** (I can get you the newest pull request from any public repo) \n' +
        'example: whats the newest pr owner=OnionQueenMemu repo=dadbot \n' +
    '3. **issue** (I can get you the newest issue from any public repo) \n' +
        'example: whats the newest issue owner=OnionQueenMemu repo=dadbot \n' +
    '4. **quote**: (Need some inspiration? Let me grab you some!)\n' +
    '5. **roll**: (Take your chances and roll some dice.)\n' 
    );
};

const sendIssue = (bot, data) => {
    bot.say("markdown", `This is the newest issue:`, '\n\n ' +
    `**Username**:  ${data.username}\n` +
    `**Issue Comment**: ${data.body} \n` +
    `**Created At**: ${data.date} \n` +
    `**URL**: ${data.html_url}`
    );
};

const sendPR = (bot, data) => {
    bot.say("markdown", `This is the newest pull request:`, '\n\n ' +
    `**Username**:  ${data.username}\n` +
    `**PR Comment**: ${data.body} \n` +
    `**Created At**: ${data.date} \n` +
    `**URL**: ${data.html_url}`
    );
};

module.exports = {
    sendHelp,
    sendIssue,
    sendPR
}