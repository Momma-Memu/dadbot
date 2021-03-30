const gitHubFetch = async (owner, repo) => {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls`);
    const data = await res.json();
    console.log(data);
    return data;
}


module.exports = gitHubFetch;