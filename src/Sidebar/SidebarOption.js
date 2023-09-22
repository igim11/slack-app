import React, { useState } from 'react';
import './SidebarOption.css';
import { useNavigate } from 'react-router-dom';

function SidebarOption({ Icon, title, id, type, addChannelOption, newMessageOption, loadChannels, loadDirectMessages }) {
  const navigate = useNavigate();

  const selectChannel = () => {
    if (id) {
      console.log('Selected Channel ID:', id);
      navigate(`/${type}/${id}`);
    } else {
      navigate(title);
    }
  };
  
  const fetchDatabase = async () => {
    let response = await fetch('http://206.189.91.54/api/v1/users', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json', // Set the Content-Type header
        ...JSON.parse(sessionStorage.getItem("user-headers")),
      },
      })
      const db = await response.json();
      console.log(db);
      return db.data;
  }

  const addChannel = async () => {
    const channelName = prompt('Please enter the channel name');
  
    if (channelName) {
      let response = await fetch('http://206.189.91.54/api/v1/channels', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Set the Content-Type header
          ...JSON.parse(sessionStorage.getItem("user-headers")),
        },
        body: JSON.stringify({
          name: channelName,
          user_ids: [],
        }),
      });
      const data = await response.json();
      console.log('New Channel', data);
      console.log(channelName);
      if (data.errors){
        alert(data.errors);
      } else {
        loadChannels();
      }
    }
  };
  
  const newMessage = async () => {
    const userName = prompt('Please enter email of user you want to send a message to')?.toString();
    const message = prompt("Please enter the message you'd like to send to the user");
    let userId = [];

    if (userName && message) {
      const db = await fetchDatabase();
  
      // Find the user object in the database where uid matches userName
      const user = db.find(user => user.uid === userName);
  
      if (user) {
        userId = user.id; // Get the 'id' property from the user object
        console.log('User ID:', userId);
      } else {
        console.log('User not found in the database.');
      }

      let response = await fetch('http://206.189.91.54/api/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json', // Set the Content-Type header
            ...JSON.parse(sessionStorage.getItem("user-headers")),
          },
          body: JSON.stringify({
            receiver_id: userId,
            receiver_class: 'User',
            body: message,
          })
        });
        const data = await response.json();
        console.log('New Message', data);
        if (data.errors){
          alert(data.errors);
        } else {
          // Create a new recent contact object
          let recentContact = { userName, userId };

          // Check if there are existing recent contacts in local storage
          let existingRecentContacts = JSON.parse(localStorage.getItem('recent-contacts')) || [];

          // Check if the recent contact already exists in the list
          let contactExists = existingRecentContacts.some((contact) => contact.userId === userId);

          // If the contact does not exist, add it to the list
          if (!contactExists) {
            existingRecentContacts.push(recentContact)};

          // Save the updated list of recent contacts back to local storage
          localStorage.setItem('recent-contacts', JSON.stringify(existingRecentContacts));

          loadDirectMessages();
          navigate(`/User/${userId}`);
        }
    }
  };
  

  return (
    <div className='sidebarOption' onClick={addChannelOption ? addChannel : newMessageOption ? newMessage : selectChannel}>
        {Icon && <Icon className="sidebarOption_icon" />}
        {Icon ? (<h3>{title}</h3>) : (<h3 className='sidebarOption_channel'><span className='sidebarOption_hash'>#</span> {title} </h3>)}
    </div>
  )
}

export default SidebarOption