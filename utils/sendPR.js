const sendPR = (bot, data) => {
    bot.say("markdown", `This is the newest pull request:`, '\n\n ' +
    `**Username**:  ${data.username}\n` +
    `**PR Comment**: ${data.body} \n` +
    `**Created At**: ${data.date}`
    );
};


module.exports = sendPR;