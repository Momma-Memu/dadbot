const fetch = require('node-fetch');

const fetchJokes = async () => {
    const response = await fetch('https://icanhazdadjoke.com/', {
        headers: { "Accept": "application/json" }
    });
    const data = await response.json();
    console.log(data)
    return data
}


module.exports = fetchJokes;