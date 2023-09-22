import React, { useState, useEffect } from 'react';
import './Sidebar.css';
import SidebarOption from './SidebarOption';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import CreateIcon from '@mui/icons-material/Create';
import InsertCommentIcon from '@mui/icons-material/InsertComment';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import DraftsIcon from '@mui/icons-material/Drafts';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import AppsIcon from '@mui/icons-material/Apps';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';

function Sidebar() {
  const [channels, setChannels] = useState([]);
  const [directMessages, setDirectMessages] = useState([]);

  const loadChannels = async () => {
      let response = await fetch('http://206.189.91.54/api/v1/channels', {
        method: 'GET',
        headers: JSON.parse(sessionStorage.getItem("user-headers"))
      });
      const data = await response.json();
      console.log('Channels:', data);
      setChannels(data.data);
  };

  const loadDirectMessages = async () => {
  // Retrieve recent contacts from local storage
  const recentContacts = JSON.parse(localStorage.getItem("recent-contacts")) || [];

  // Initialize an array to store direct messages
  const messages = [];

  // Iterate over each recent contact
  for (const recentContact of recentContacts) {
    const { userId } = recentContact;

    // Make a request to fetch direct messages for the user
    let response = await fetch(`http://206.189.91.54/api/v1/messages?receiver_id=${userId}&receiver_class=User`, {
      method: 'GET',
      headers: JSON.parse(sessionStorage.getItem("user-headers"))
    });

    const data = await response.json();
    
    // Check if the fetched data is not null
    if (!data.errors) {
      messages.push(...data.data);
    }
  }
  console.log('DM', messages);
  // Set the directMessages state with the fetched messages
  setDirectMessages(messages);
};

  
  useEffect(() => {
    loadChannels();
    loadDirectMessages();
  }, []);


  return (
    <div className='sidebar'>
        <div className='sidebar_header'>
            <div className='sidebar_info'>
                <h2>Avion School</h2>
                <h3>
                    <FiberManualRecordIcon />
                    {JSON.parse(sessionStorage.getItem("user-headers")).uid}
                </h3>
            </div>
            <CreateIcon />
        </div>
        <SidebarOption Icon={InsertCommentIcon} title='Threads' />
        <SidebarOption Icon={AlternateEmailIcon} title='Mentions & reactions' />
        <SidebarOption Icon={DraftsIcon} title='Saved items' />
        <SidebarOption Icon={BookmarkBorderIcon} title='Channel browser' />
        <SidebarOption Icon={PeopleAltIcon} title='People & user groups' />
        <SidebarOption Icon={AppsIcon} title='Apps' />
        <SidebarOption Icon={FileCopyIcon} title='File browser' />
        <SidebarOption Icon={ExpandLessIcon} title='Show less' />
        <hr />
        <SidebarOption Icon={ExpandMoreIcon} title='Channels' />
        <SidebarOption Icon={AddIcon} addChannelOption title='Add Channel' loadChannels={loadChannels} />
        {channels?.map(channel => (
          <SidebarOption title={channel.name} id={channel.id} key={channel.id} type='Channel' />
        ))}
        {/* connect to DB and add all channels */}
        <hr />
        <SidebarOption Icon={ExpandMoreIcon} title='Direct Messages' />
        <SidebarOption Icon={AddIcon} newMessageOption title='New Message' loadDirectMessages={loadDirectMessages} />
        {[...new Set(directMessages?.map((directMessage) => directMessage.receiver?.id))].map((uniqueReceiverId) => {
        const correspondingMessage = directMessages.find((message) => message.receiver?.id === uniqueReceiverId);
        return (
          <SidebarOption title={correspondingMessage.receiver?.uid} id={uniqueReceiverId} key={uniqueReceiverId} type='User' />
        );
        })}
        {/* connect to DB and add all DMs */}
    </div>
  )
}

export default Sidebar