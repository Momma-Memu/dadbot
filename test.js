const fetch = require('node-fetch');

const fetchData = async () => {
    const res = await fetch('https://api.github.com/repos/OnionQueenMemu/dadbot/pulls', {
        headers: {"Accept": "application/vnd.github.v3+json"}
    });
    const data = await res.json();
    console.log(data)
}


fetchData();