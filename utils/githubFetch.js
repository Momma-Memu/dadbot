const { Octokit } = require("@octokit/core");
const octokit = new Octokit();

const gitHubFetch = async (owner, repo) => {
    const res = await octokit.request('GET /repos/{owner}/{repo}/pulls', {
        owner: owner,
        repo: repo
    });
    const data = await res.json();
    console.log(data);
    return data;
}


module.exports = gitHubFetch;