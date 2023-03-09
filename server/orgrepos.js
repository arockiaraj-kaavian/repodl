function orgrepos(username,token){

const request = require('request');

const org = `${orgname}`;  // Replace with your organization name
const Token = `${token}`;   // Replace with your OAuth token

const options = {
  url: `https://api.github.com/orgs/${org}/repos`,
  headers: {
    'User-Agent': 'request',
    'Authorization': `token ${Token}`
  }
};

request(options, (error, response, body) => {
  if (!error && response.statusCode == 200) {
    const repos = JSON.parse(body);
    console.log(repos,'repos');
     return repos;
  } else {
    console.log(error);
  }
});
}
module.exports={orgrepos}