import React, { useEffect, useState } from 'react';
import './Chat.css';
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AddIcon from '@mui/icons-material/Add';
import Message from './Message';
import ChatInput from './ChatInput';
import { useParams } from 'react-router-dom';

function Chat() {
  const { roomType, roomId } = useParams();
  const [roomDetails, setRoomDetails] = useState(null);
  const [roomMessages, setRoomMessages] = useState([]);

  const fetchDatabase = async () => {
    let response = await fetch('http://206.189.91.54/api/v1/users', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json', // Set the Content-Type header
        ...JSON.parse(sessionStorage.getItem("user-headers")),
      },
      })
      const db = await response.json();
      return db.data;
  }

  const loadRoomDetails = async () => {
    if (roomType === 'Channel') {
      let response = await fetch(`http://206.189.91.54/api/v1/channels/${roomId}`, {
        method: 'GET',
        headers: JSON.parse(sessionStorage.getItem("user-headers"))
      });
      const data = await response.json();
      console.log('Channel Details:', data);
      setRoomDetails(data.data);
    } else {
      let userId = roomId;
      let userName = '';
    
      const recentContacts = JSON.parse(localStorage.getItem("recent-contacts"));
    
      // Find the recent contact object in local storage where the id matches userId
      const recentContact = recentContacts.find(contact => contact.userId == userId);
    
      if (recentContact) {
        userName = recentContact.userName; // Get the 'userName' property from the recent contact object
        console.log('User:', userName);
        setRoomDetails(userName);
      } else {
        console.log('User not found in recent contacts.');
        console.log(userId);
        console.log(userName);
        console.log(recentContacts);
        console.log(recentContact);
      }
    }    
};

  const loadRoomMessages = async () => {
    let response = await fetch(`http://206.189.91.54/api/v1/messages?receiver_id=${roomId}&receiver_class=${roomType}`, {
      method: 'GET',
      headers: JSON.parse(sessionStorage.getItem("user-headers"))
    });
    const data = await response.json();
    console.log('Channel Messages:', data);
  
    // Create a Set to store unique messages based on their IDs
    const uniqueMessagesSet = new Set();
    data.data.forEach((message) => {
      uniqueMessagesSet.add(message.id);
    });
  
    // Convert the Set back to an array of unique messages
    const uniqueMessages = [...uniqueMessagesSet].map((messageId) =>
      data.data.find((message) => message.id === messageId)
    );
  
    setRoomMessages(uniqueMessages);
  };

  useEffect(() => {
    loadRoomDetails();
    loadRoomMessages();
  }, [roomId]);

 
  const addMember = async () => {
    const userName = prompt('Please enter email of user you want to add to the channel')?.toString();
    let userId = [];

    if (userName) {
      const db = await fetchDatabase();
  
      // Find the user object in the database where uid matches userName
      const user = db.find(user => user.uid === userName);
  
      if (user) {
        userId = user.id; // Get the 'id' property from the user object
        console.log('User ID:', userId);
      } else {
        console.log('User not found in the database.');
      }

      let response = await fetch('http://206.189.91.54/api/v1/channel/add_member', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Set the Content-Type header
          ...JSON.parse(sessionStorage.getItem("user-headers")),
        },
        body: JSON.stringify({
          id: roomId,
          member_id: userId,
        }),
      });
      const data = await response.json();
      console.log('Add Member', data);
      if (data.errors){
        alert(data.errors);
      } else {
        alert('Member successfully added');
      }
    }
  }

  return (
    <>
    <div className='chat'>
      <div className='chat_header'>
        <div className='chat_headerLeft'>
          <h4 className='chat_channelName'>
            <strong>#{roomType === 'Channel' ? roomDetails?.name : roomDetails?.toString()}</strong>
            <StarBorderOutlinedIcon />
          </h4>
        </div>
        <div className='chat_headerRight'>
          <p>
            <InfoOutlinedIcon /> Details
          </p>
          {(roomType === 'Channel') && <AddIcon onClick={addMember} />}
        </div>
      </div>

      <div className='chat_message'>
    {roomMessages.map(({ body, created_at, id, sender }) => (
      <Message
        key={id} // Provide a unique key using the message ID
        message={body}
        timestamp={created_at}
        user={sender ? sender.uid : ''} // Check if sender is defined before accessing uid
      />
    ))}
  </div>

      <ChatInput channelName={roomType === 'Channel' ? roomDetails?.name : roomDetails} channelId={roomId} roomType={roomType} loadRoomMessages={loadRoomMessages} />
    </div>
    </>
  )
}

export default Chat