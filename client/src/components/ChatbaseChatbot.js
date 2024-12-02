import React, { useEffect, useState } from 'react';
import {Row, Col} from 'react-bootstrap';
import { Button} from 'react-bootstrap';

const ChatbaseChatbot = () => {
  const [reloadKey, setReloadKey] = useState(0); // State to trigger reloads

  // Function to reload the chatbot
  const reloadChatbot = () => {
    setReloadKey((prevKey) => prevKey + 1); // Increment the key to trigger re-render
  };

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
  }, [[reloadKey]]);

  return (
    <div>
    <Row className="align-items-center" style={{ marginTop: '20px' }}>
      <Col style={{ textAlign: 'left', display: 'flex', gap: '10px' }}>
          <Button onClick={reloadChatbot} id="generate_schedule" data-testid="generate_schedule">
          Reload Chatbot with Updated Coursework
          </Button>
      </Col>
    </Row >
    </div>
  );
};

export default ChatbaseChatbot;
