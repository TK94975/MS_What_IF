import React, { useEffect, useState } from 'react';
import {Row, Col} from 'react-bootstrap';
import { Button} from 'react-bootstrap';

const ChatbaseChatbot = () => {
  const [reloadKey, setReloadKey] = useState(0); // State to trigger reloads

    const updateChatbotSettingsInitial = async () => {
        const chatbotId = "75In3HL0Qo1lNM8bQCuyu"; // Your Chatbot ID
        const secretKey = "33777c78-c604-466b-a976-ca708abfd62b"; // Your API Secret Key
      
        const initialMessage = 'Hello! How may I assist? Please enter your coursework and reload me for context specific assistance.';
      
        const payload = {
          chatbotId,
          initialMessages: [
              initialMessage
          ],
        };

          try {
            const response = await fetch("https://www.chatbase.co/api/v1/update-chatbot-settings", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${secretKey}`,
              },
              body: JSON.stringify(payload),
            });
        
            if (response.ok) {
              console.log("Chatbot settings updated successfully!");
            } else {
              const error = await response.json();
              console.error("Failed to update chatbot settings:", error);
            }
          } catch (err) {
            console.error("Error while updating chatbot settings:", err);
          }
    };


  // Function to reload the chatbot
  const reloadChatbot = () => {
    setReloadKey((prevKey) => prevKey + 1); // Increment the key to trigger re-render
  };


  useEffect(() => {
    updateChatbotSettingsInitial(); // Update chatbot settings
  }, []); 
  
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
      <div style={{ padding: '10px', textAlign: 'center' }}>
          <div>
              <Button
                  onClick={reloadChatbot}
                  id="generate_schedule"
                  data-testid="generate_schedule"
                  style={{margin: '5px', padding: '5px'}}
              >
                  Reload Chatbot with Updated Coursework
              </Button>
              <div style={{padding: "7px"}}></div>
          </div>
      </div>
  );
};

export default ChatbaseChatbot;
