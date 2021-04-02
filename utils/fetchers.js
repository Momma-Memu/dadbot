const fetch = require('node-fetch');

const fetchIssue = async (owner, repo, bot) => {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues`, {
        headers: {"Accept": "application/vnd.github.v3+json"}
    });
    if(res.ok){
        const data = await res.json();
        let info;
        
        // control for a proper response, all PRs are issues, but not all issues are PRs.
        // https://docs.github.com/en/rest/reference/issues
        for(let resObject of data){
            if(!resObject['pull_request']){
                info = resObject;
                break;
            }
        }
        
        // if the response is empty return null as there is no issues.
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

const fetchPR = async (owner, repo, bot) => {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls`, {
        headers: {"Accept": "application/vnd.github.v3+json"}
    });

    if(res.ok){
        const data = await res.json();
        const info = data[0];

        // if the response is empty return null as there is no PRs.
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

const fetchJokes = async (bot) => {
    const res = await fetch('https://icanhazdadjoke.com/', {
        headers: { "Accept": "application/json" }
    });

    if(res.ok){
        const data = await res.json();
        return data
    } else {
        bot.say("Surely I could not find a joke, and don't call me Shirly.")
    }

}

const fetchQuote = async () => {
    const res = await fetch('https://zenquotes.io/api/random');
    if(res.ok){
        const data = await res.json();

        // destructure q, (question), and a, (answer) from the response object.
        const { q, a } = data[0];
        return { q, a };
    } else {
        bot.say("Oh dear, I couldn't find a quote, don't tell mombot.")
    }
};

module.exports = {
    fetchIssue,
    fetchJokes,
    fetchPR,
    fetchQuote,
}