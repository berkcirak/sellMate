import React, { useState, useEffect } from 'react';
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
  const [refreshTrigger, setRefreshTrigger] = useState(0);

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
  useEffect(() => {
    const handleRefresh = () => {
      setRefreshTrigger(prev => prev + 1);
    };

    window.addEventListener('conversationListRefresh', handleRefresh);
    
    return () => {
      window.removeEventListener('conversationListRefresh', handleRefresh);
    };
  }, []);
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
            refreshTrigger={refreshTrigger}
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