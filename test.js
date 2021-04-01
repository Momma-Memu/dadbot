const fetch = require('node-fetch');

const fetchData = async () => {
    const res = await fetch('http://6b356c8e57f6.ngrok.io/pulls/notifications', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({key: 'value'})
    });
    // const data = await res.json();
    // const info = data[data.length - 1];
    // const { body, url } = info;
    // const username = info.user.login;
    // const date = info.created_at.split('T')[0]
    // return { body, url, username, date};
}


fetchData();

// in a galaxy far far away