import React, { useState } from 'react';
import './Register.css';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

  const registerAccount = async(e) => {
    e.preventDefault();

    let response = await fetch('http://206.189.91.54/api/v1/auth/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'email': email,
            'password': password,
            'password_confirmation': confirmPassword
        })
    });
    const data = await response.json();
    console.log(data);
    if (!email) {
        alert('Please enter email');
    } else if (!password) {
        alert('Please enter password');
    } else if (password.length < 6) {
        alert('Password must be at least 6 characters');
    } else if (password !== confirmPassword) {
        alert('Password and Confirm Password must match');
    } else {
        navigate("/");
    }
  }

  const backToLogin = () => {
    navigate('/');
  }

  return (
    <div className='login'>
        <div className='login_container'>
            <img src='https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Slack_icon_2019.svg/2048px-Slack_icon_2019.svg.png' alt='logo'></img>
            <h1>Create an Account</h1>
            <form onSubmit={registerAccount} className='login_form'>
                <input onChange={(e) => setEmail(e.target.value)} className='email' placeholder='email' type='email' />
                <input onChange={(e) => setPassword(e.target.value)} className='password' type='password' placeholder='password' />
                <input onChange={(e) => setConfirmPassword(e.target.value)} className='confirm_password' type='password' placeholder='confirm password' />
                <Button className='login_button' type='submit'>Register</Button>
            </form>
            <p onClick={backToLogin} className='register'>Back to Login</p>
        </div>
    </div>
  )
}

export default Register