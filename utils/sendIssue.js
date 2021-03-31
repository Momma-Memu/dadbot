const sendIssue = (bot, data) => {
    bot.say("markdown", `This is the newest pull request:`, '\n\n ' +
    `**Username**:  ${data.username}\n` +
    `**Issue Comment**: ${data.body} \n` +
    `**Created At**: ${data.date} \n` +
    `**URL**: ${data.html_url}`
    );
};


module.exports = sendIssue;