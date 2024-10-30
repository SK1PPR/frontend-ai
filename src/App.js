import React, { useEffect, useState } from "react";

// Component to render rrweb DOM content
function DomRenderer() {
  const [htmlContent, setHtmlContent] = useState("");

  useEffect(() => {
    // Fetch initial DOM snapshot from the server
    const fetchDomSnapshot = async () => {
      try {
        const response = await fetch("/api/dom-snapshot");
        const data = await response.json();
        setHtmlContent(data.html); // Assuming the response has { html: "<div>...</div>" }
      } catch (error) {
        console.error("Error fetching DOM snapshot:", error);
      }
    };

    fetchDomSnapshot();
  }, []);

  return (
    <div
      dangerouslySetInnerHTML={{ __html: htmlContent }}
      style={{
        border: "1px solid black",
        padding: "10px",
        height: "100%",
        overflow: "auto",
      }}
    />
  );
}

// Simple chatbox component
function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // Fetch initial messages from the server
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/messages");
        const data = await response.json();
        setMessages(data.messages); // Assuming server response { messages: ["msg1", "msg2"] }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, []);

  // Handle sending a new message
  const handleSend = async () => {
    if (!input.trim()) return;

    try {
      const response = await fetch("http://localhost:5001/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();

      if (data.result) {
        // Add the response message to the chat display
        setMessages((prevMessages) => [...prevMessages, `GPT: ${data.result}`]);
        setInput("");
      } else {
        console.error("Error sending message:", data.error);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div style={{ border: "1px solid gray", padding: "10px", height: "100%" }}>
      <div
        style={{
          height: "80%",
          overflowY: "auto",
          marginBottom: "10px",
          borderBottom: "1px solid lightgray",
        }}
      >
        {messages.map((message, index) => (
          <div key={index} style={{ padding: "5px 0" }}>
            {message}
          </div>
        ))}
      </div>
      <div style={{ display: "flex" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ flex: 1, marginRight: "5px" }}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}

// Main layout component
function App() {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* <div style={{ flex: 3, padding: "10px" }}>
        <DomRenderer />
      </div> */}
      <div
        style={{ flex: 1, padding: "10px", borderLeft: "1px solid lightgray" }}
      >
        <ChatBox />
      </div>
    </div>
  );
}

export default App;
