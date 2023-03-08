
function downloadrepo(username,reponame,token,branch){
const { Octokit } = require('@octokit/rest', '@octokit/core');
const fs = require('fs');


const gitToken=token;
 
const octokit = new Octokit({
    auth: `${gitToken}`
  });
  

 
var targetProjectRoot = "C:/data/target/"
const github = { "owner": username, "repo": reponame, "branch":branch }
 
downloadGitHubRepo(github, targetProjectRoot)
 
async function downloadGitHubRepo(github, targetDirectory) {
    console.log(`Installing GitHub Repo ${github.owner}\\${github.repo}`)
    var repo = github.repo;
    var path = '';
    var owner = github.owner;
    var ref = github.commit ? github.commit : (github.tag ? github.tag : (github.branch ? github.branch :'master'))
    processGithubDirectory(owner, repo, ref, path, path, targetDirectory)
}
 
// let's assume that if the name ends with one of these extensions, we are dealing with a binary file:
const binaryExtensions = ['png', 'jpg', 'tiff', 'wav', 'mp3', 'doc', 'pdf']
var maxSize = 100000000;
function processGithubDirectory(owner, repo, ref, path, sourceRoot, targetRoot) {
    octokit.repos.getContent({"owner": owner, "repo": repo, "path": path, "ref": ref })
        .then(result => {
            var targetDir = targetRoot + path
            // check if targetDir exists 
            checkDirectorySync(targetDir)
            result.data.forEach(item => {
                if (item.type == "dir") {
                    processGithubDirectory(owner, repo, ref, item.path, sourceRoot, targetRoot)
                } // if directory
                if (item.type == "file") {
                    if (item.size > maxSize) {
                        var sha = item.sha
                        octokit.gitdata.getBlob({"owner": owner, "repo": repo, "sha": item.sha }
                        ).then(result => {
                            var target = `${targetRoot + item.path}`
                            fs.writeFile(target
                                , Buffer.from(result.data.content, 'base64').toString('utf8'), function (err, data) { })
                        })
                            .catch((error) => { console.log("ERROR BIGGA" + error) })
                        return;
                    }// if bigga
                    octokit.repos.getContent({ "owner": owner, "repo": repo, "path": item.path, "ref": ref })
                        .then(result => {
                            var target = `${targetRoot + item.path}`
                            if (binaryExtensions.includes(item.path.slice(-3))) {
                                fs.writeFile(target
                                    , Buffer.from(result.data.content, 'base64'), function (err, data) { reportFile(item, target) })
                            } else
                                fs.writeFile(target
                                    , Buffer.from(result.data.content, 'base64').toString('utf8'), function (err, data) { if (!err) reportFile(item, target); else console.log('Error' + err) })
 
                        })
                        .catch((error) => { console.log("ERROR " + error) })
                }// if file
            })
        }).catch((error) => { console.log("ERROR IN" + error) })
}//processGithubDirectory
 
function reportFile(item, target) {
    console.log(`- installed ${item.name} (${item.size} bytes )in ${target}`)
}
 
function checkDirectorySync(directory) {
    try {
        fs.statSync(directory);
    } catch (e) {
        fs.mkdirSync(directory);
        console.log("Created directory: " + directory)
    }
}
}
module.exports={downloadrepo};