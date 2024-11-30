import React, { useEffect } from 'react';

const ChatbaseChatbot = () => {
  useEffect(() => {
    // Chatbot config 
    window.embeddedChatbotConfig = {
      chatbotId: '75In3HL0Qo1lNM8bQCuyu',
      domain: 'www.chatbase.co',
    };

    // Javascript element to load the chatbot script
    const script = document.createElement('script');
    script.src = 'https://www.chatbase.co/embed.min.js';
    script.async = true;
    script.defer = true;
    script.setAttribute('chatbotId', '75In3HL0Qo1lNM8bQCuyu');
    script.setAttribute('domain', 'www.chatbase.co');

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return null; // no visible component to return
};

export default ChatbaseChatbot;
