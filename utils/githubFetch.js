const fetch = require('node-fetch');

const gitHubFetch = async (owner, repo) => {
    const res = await fetch('https://api.github.com/repos/OnionQueenMemu/dadbot/pulls', {
        headers: {"Accept": "application/vnd.github.v3+json"}
    });
    const data = await res.json();
    const info = data[data.length - 1];
    const { body, url } = info;
    const username = info.user.login;
    const date = info.created_at.split('T')[0]
    return { body, url, username, date};
}

gitHubFetch('TheOnionQueen', 'dadbot')

module.exports = gitHubFetch;