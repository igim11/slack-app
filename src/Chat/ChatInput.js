import React, { useState } from 'react';
import './ChatInput.css';

function ChatInput({ channelName, channelId, roomType, loadRoomMessages }) {
    const [input, setInput] = useState('');

    const sendMessage = async (e) => {
      e.preventDefault();
  
      if (channelId) {
        let response = await fetch('http://206.189.91.54/api/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json', // Set the Content-Type header
            ...JSON.parse(sessionStorage.getItem("user-headers")),
          },
          body: JSON.stringify({
            receiver_id: channelId,
            receiver_class: roomType,
            body: input,
          })
        });
        const data = await response.json();
        console.log(channelId);
        console.log("Message", data);
        loadRoomMessages();
  
        // Clear the input after sending the message
        setInput('');
      }
  };
  

  return (
    <div className='chatInput'>
        <form onSubmit={sendMessage}>
            <input value={input} onChange={e => setInput(e.target.value)} placeholder={`Message #${channelName?.toString().toLowerCase()}`}></input>
            <button type='submit'>SEND</button>
        </form>
    </div>
  )
}

export default ChatInput