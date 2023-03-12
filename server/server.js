const express = require("express");
const cors = require("cors");
const { downloadrepo } = require("./downloadrepo");
const { downloadorgrepo } = require('./orgrepodl');
// const { orgrepos } = require('./orgrepos');

// const {userrepos} = require('./userrepos');
const { Octokit } = require("@octokit/rest", "@octokit/core");


const request = require('request');

// const Bottleneck = require('bottleneck');


// const limiter = new Bottleneck({
//   maxConcurrent: 1, // Maximum number of requests/functions to execute concurrently
//   minTime: 1000 // Minimum time to wait between requests/functions (in milliseconds)
// });


const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());


const clientId = "a3db7bab825b120b6119";
const clientSecret = "688740d90c1c8680741ad4886fd3022066a20d0d";

const mongoose = require("mongoose");
mongoose.set("strictQuery", true);

// const request=require('request');
const Tokens = require("./schema");
const bodyparser = require("body-parser");
app.use(cors({ origin: "http://localhost:3000" }));

app.use(bodyparser.json());
mongoose.connect("mongodb://localhost:27017/Taas");
const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("DB Connected successfully");
});

// app.get('/login',async(req,res)=>{
//   const url=`https://github.com/login/oauth/authorize?client_id=${clientId}`;
//   res.redirect(url);
// })

app.post('/orgrepos', async (req, res) => {

  const { orgname, token } = req.body;
  console.log(orgname, token);

  const accessToken = `${token}`;
  const organization = `${orgname}`;
  const options = {
    url: `https://api.github.com/orgs/${organization}/repos`,
    headers: {
      'User-Agent': 'request',
      Authorization: `token ${accessToken}`
    }
  };
  request(options, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      const repositories = JSON.parse(body);
      const repositoryNames = repositories.map(repo => repo.name);
      const repos = repositoryNames;
      console.log(repos);
      res.json(repos);
    } else {
      console.error(error);
    }
  });

});

app.post('/userepos', async (req, res) => {

  const { username, token } = req.body;
  console.log(username, token);

  const accessToken = `${token}`;
  const user = `${username}`;

  const options = {
    url: `https://api.github.com/users/${user}/repos`,
    headers: {
      'User-Agent': 'request',
      Authorization: `token ${accessToken}`
    }
  };
  request(options, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      const repositories = JSON.parse(body);
      const repositoryNames = repositories.map(repo => repo.name);
      const repos = repositoryNames;
      console.log(repos);
      res.json(repos);
    } else {
      console.error(error);
    }
  });

});
app.post('/orgrepoget', async (req, res) => {

  const { orgname, reponame, token, branch } = req.body;

  console.log(orgname, reponame, token, branch);

  downloadorgrepo(orgname, reponame, token, branch);

});

app.post('/userepoget', async (req, res) => {

  const { username, reponame, token, branch } = req.body;

  console.log(username, reponame, token, branch)

  downloadrepo(username, reponame, token, branch);

});

// store the token in database
app.post("/intoken", async (req, res) => {
  const { token } = req.body;
  console.log(token);
  await Tokens.create({ Token: token });
});



app.get("/getAccessToken", async (req, res) => {
  // console.log(req.query.code);
  const params =
    "?client_id=" +
    clientId +
    "&client_secret=" +
    clientSecret +
    "&code=" +
    req.query.code;
  await fetch("https://github.com/login/oauth/access_token" + params, {
    method: "post",
    headers: {
      Accept: "application/json",
    },
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      res.json(data);
      //const data = JSON.parse(body);
      //const token = data.access_token;
      //res.send(`Access Token: ${accessToken}`); //send the token to browser screen and display in browser only.
      //res.json(token); //send the token to client side process.
    });
});




app.listen(3001, () => {
  console.log("server is running on port 3001");
});
