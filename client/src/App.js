/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect,useState } from 'react';
import './App.css';


function App() {

  const clientId='a3db7bab825b120b6119';

  const redirectUri = 'http://localhost:3000/callback';

  const scopes = 'user,repo';

  const [rerender,setRerender]=useState(false);
  const [userdata,setUserdata]=useState({});
  const [username,setUsername]=useState('');
  const [reponame,setReponame]=useState('');
  const [data,setData]=useState('');
  const[token,setToken]=useState('');
  const[branch,setBranch]=useState('');

  //const token = data.access_token;
  //console.log(token);

  useEffect(()=>{
    const queryString=window.location.search;
    const urlParams=new URLSearchParams(queryString);
    const codeparam=urlParams.get('code');
    // console.log(codeparam);

    if(codeparam&&(localStorage.getItem("accessToken")===null)){
      async function getAccessToken(){
        await fetch("http://localhost:3001/getAccessToken?code="+codeparam,{
          method :'get',
        }).then((res)=> res.json())
          .then((data)=>{
          console.log(data.access_token);
          setToken(data.access_token);
          if(data.access_token){
            localStorage.setItem("accessToken",data.access_token);
            setRerender(!rerender);
          }
        })
      }
      getAccessToken();
    }
})



   function download(){

     // window.location.assign(`https://github.com/login/oauth/authorize?client_id=${clientId}`);

     fetch("http://localhost:3001/repodownload",{
      method:"post",
      body:JSON.stringify({username,reponame,token,branch}),
      headers:{
        "content-type":"application/json"
      }
    }).then((res)=>{
       res.json();
    }).then((data)=>{
      console.log(data);
    })
    console.log('repo downloaded successfully');

    setUsername('');
    setReponame('');
    setBranch('');
    }


    function getrepo(){

       // window.location.assign(`https://github.com/login/oauth/authorize?client_id=${clientId}`);

       fetch("http://localhost:3001/repos",{
        method:"post",
        body:JSON.stringify({ username,token }),
        headers:{
            "content-type":"application/json"
        }
      }).then((res)=>res.json()).then((data)=>{
        setData(data);
      })
    }

    function githublogin(){

      window.location.assign(`https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes}`);

  }

  return (
    <div className="App">
    {localStorage.getItem("accessToken")?
    <>
    <button className='logout' onClick={()=>{localStorage.removeItem("accessToken");setRerender(!rerender)}}>
      Log out
    </button>
    <div className='form'>
    <h2 className='title'>Get user data from github</h2>
    <input type='text' className='user' placeholder='Enter  github username' value={username} onChange={e =>setUsername(e.target.value)} /><br/><br/>
    &nbsp;&nbsp;&nbsp;&nbsp;
    <button  className='repo' onClick={getrepo}>Get repos</button><br/><br/>

    <select  className='repository' value={reponame} onChange={e =>setReponame(e.target.value)}>
      
      <option>select the repo name </option>
      {!data? (" ") : data.map((rep) =>(
        <option>{rep}</option>
      ))} 
    </select> <br /><br />
    <input type='text'  className='branch' placeholder='Enter the branch name' value={branch} onChange={e=>setBranch(e.target.value)} />
    <br/><br/>
    <button  className='download' onClick={download}>Download repo</button> <br /> <br />
    </div>
    {Object.keys(userdata).length!==0?
    <>
    <div className='profile'>
    <h2>Hello user &nbsp;&nbsp;{userdata.login}</h2>
    
    <a href={userdata.html_url}>Link to github user profile page</a>
    </div>
    </>
    :
    < >
    </>
    }
    </>
    :
    <>
    <div className='login'>
    <button className='login'  onClick={githublogin}>
      Login with github
    </button>
    </div>
    </>
    }
    </div>
  );
}
export default App;
