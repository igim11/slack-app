import React from 'react';
import './Message.css';
import { Avatar } from '@mui/material'

function Message({ message, timestamp, user, userImage }) {
  const date = new Date(timestamp);

  // Formatting the Date
  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short',
  };

  const formattedTimestamp = date.toLocaleString(undefined, options);

  return (
    <div className='message'>
      <Avatar className='message_avatar' alt='' src=''/>
        <div className='message_info'>
            <h4>{user} <span className='message_timestamp'>{formattedTimestamp}</span></h4>
            <p>{message}</p>
        </div>
    </div>
  )
}

export default Message