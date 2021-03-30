const fetch = require('node-fetch');

const gitHubFetch = async (owner, repo, bot) => {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls`, {
        headers: {"Accept": "application/vnd.github.v3+json"}
    });

    if(res.ok){
        const data = await res.json();
        const info = data[data.length - 1];
        const { body, url } = info;
        const username = info.user.login;
        const date = info.created_at.split('T')[0]
        return { body, url, username, date};
    } else {
        bot.say('Oh dear, I cannot find the repository or user you mentioned. Not to be rude, but did you spell it right?')
    }
}

gitHubFetch('TheOnionQueen', 'dadbot')

module.exports = gitHubFetch;