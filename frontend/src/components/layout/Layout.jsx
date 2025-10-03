// frontend/src/components/layout/Layout.jsx
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import ConversationList from '../messages/ConversationList';
import MessageBox from '../messages/MessageBox';
import '../../styles/components/layout.css';
import Navbar from './Navbar';

export default function Layout() {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isMessageBoxOpen, setIsMessageBoxOpen] = useState(false);

  const handleSelectConversation = (conversation, user) => {
    setSelectedConversation(conversation);
    setSelectedUser(user);
    setIsMessageBoxOpen(true);
  };

  const handleCloseMessageBox = () => {
    setIsMessageBoxOpen(false);
    setSelectedConversation(null);
    setSelectedUser(null);
  };

  return (
    <div className="layout">
      <Sidebar />

      <main className="layout-main">
      <Navbar />
        <div className="page-content">
          <Outlet />
        </div>
        <div className="layout-right">
          <ConversationList 
            onSelectConversation={handleSelectConversation}
            selectedConversationId={selectedConversation?.id}
          />
        </div>
      </main>
      <MessageBox 
        conversation={selectedConversation}
        otherUser={selectedUser}
        isOpen={isMessageBoxOpen}
        onClose={handleCloseMessageBox}
      />
    </div>
  );
}