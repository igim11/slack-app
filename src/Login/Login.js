import React, { useState } from 'react';
import './Login.css';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

  const signIn = async(e) => {
    e.preventDefault();

    let userInfo = { email, password};
    let response = await fetch('http://206.189.91.54/api/v1/auth/sign_in', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userInfo)
    });
    const data = await response.json();
    const userHeaders = await {
      "access-token": response.headers.get("access-token"),
      client: response.headers.get("client"),
      expiry: response.headers.get("expiry"),
      uid: response.headers.get("uid"),
    }
    sessionStorage.setItem('user-info', JSON.stringify(data));
    sessionStorage.setItem('user-headers', JSON.stringify(userHeaders));
    console.log(data);
    console.log(userHeaders);
    if (data.success === false){
      alert(data.errors);
    } else {
      window.location.reload();
    }
  }

  const register = () => {
    navigate('/register');
  }

  return (
    <div className='login'>
        <div className='login_container'>
            <img src='https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Slack_icon_2019.svg/2048px-Slack_icon_2019.svg.png' alt='logo'></img>
            <h1>Sign in to Avion</h1>
            <p>Avion.slack.com</p>
            <form onSubmit={signIn} className='login_form'>
                <input onChange={(e) => setEmail(e.target.value)} className='email' placeholder='email' type='email' />
                <input onChange={(e) => setPassword(e.target.value)} className='password' type='password' placeholder='password' />
                <Button className='login_button' type='submit'>Sign In</Button>
            </form>
            <p onClick={register} className='register'>Create an Account</p>
        </div>
    </div>
  )
}

export default Login