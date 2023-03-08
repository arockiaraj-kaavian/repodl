const express = require("express");
const cors = require("cors");
const {downloadrepo} = require("./downloadrepo");

const { Octokit } = require("@octokit/rest","@octokit/core");


const Bottleneck = require('bottleneck');


const limiter = new Bottleneck({
  maxConcurrent: 1, // Maximum number of requests/functions to execute concurrently
  minTime: 1000 // Minimum time to wait between requests/functions (in milliseconds)
});


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
mongoose.connect("mongodb+srv://yellowTeam:5ALD0k69147PSvF3@db-kaavian-sys-cluster-in1-966a0c87.mongo.ondigitalocean.com/yellowDB?tls=true&authSource=admin&replicaSet=db-kaavian-sys-cluster-in1");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("DB Connected successfully");
});
// app.get('/login',async(req,res)=>{
//   const url=`https://github.com/login/oauth/authorize?client_id=${clientId}`;
//   res.redirect(url);
// })


app.post('/repos',async(req,res)=>{
  const{username,token}=req.body;
  console.log(username,token);

  const gitToken = token;

  const octokit = new Octokit({
    auth: `${gitToken}`
  });


  let repos;
  async function getPrivateRepoNamesForUser(username){
    const { data } = await octokit.repos.listForUser({
      username: username,
      visibility: "private",
    });
  
    const repoNames = data.map((repo) => repo.name);
    return repoNames;
  }
  getPrivateRepoNamesForUser(username).then((repoNames) => {
        // res.json(repoNames)
        repos=repoNames;
        res.json(repos);
    });
})

app.post('/repodownload',async(req,res)=>{

  const{username,reponame,token,branch}=req.body;

  console.log(username,reponame,token,branch)

  downloadrepo(username,reponame,token,branch);

});

// store the token in database
// app.post("/intoken", async (req, res) => {
//   const { codeparams } = req.body;
//   console.log(codeparams);
//   await Tokens.create({ Token: codeparams });
// });



app.get("/getAccessToken", async (req, res) => {
  // console.log(req.query.code);
  const params =
    "?client_id=" +
    clientId +
    "&client_secret=" +
    clientSecret +
    "&code=" +
    req.query.code;
  await fetch("https://github.com/login/oauth/access_token" + params,{
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