const fetch = require('node-fetch');

const fetchIssue = async (owner, repo, bot) => {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues`, {
        headers: {"Accept": "application/vnd.github.v3+json"}
    });

    if(res.ok){
        const data = await res.json();
        // console.log(data)
        const info = data[0];
        console.log(info)
        if(info === undefined){
            return null;
        };
        const { body, html_url } = info;
        const username = info.user.login;
        const date = info.created_at.split('T')[0]
        return { body, html_url, username, date};
    } else {
        bot.say('Oh dear, I cannot find the repository or user you mentioned. Not to be rude, but did you spell it right?')
    }
}

const fetchJokes = async () => {
    const response = await fetch('https://icanhazdadjoke.com/', {
        headers: { "Accept": "application/json" }
    });
    const data = await response.json();
    console.log(data)
    return data
}

const fetchPR = async (owner, repo, bot) => {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls`, {
        headers: {"Accept": "application/vnd.github.v3+json"}
    });

    if(res.ok){
        const data = await res.json();
        const info = data[data.length - 1];
        if(info === undefined){
            return null;
        };
        const { body, html_url } = info;
        const username = info.user.login;
        const date = info.created_at.split('T')[0]
        return { body, html_url, username, date};
    } else {
        bot.say('Oh dear, I cannot find the repository or user you mentioned. Not to be rude, but did you spell it right?')
    }
}

module.exports = {
    fetchIssue,
    fetchJokes,
    fetchPR
}