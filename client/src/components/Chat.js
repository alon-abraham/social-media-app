import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMessages, addMessage } from '../redux/chatSlice';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

function Chat({ userId }) {
  const dispatch = useDispatch();
  const { messages } = useSelector((state) => state.chat);
  const [message, setMessage] = useState('');

  useEffect(() => {
    dispatch(fetchMessages(userId));

    socket.on('receiveMessage', (data) => {
      if (data.receiver === userId || data.sender === userId) {
        dispatch(addMessage(data));
      }
    });
  }, [dispatch, userId]);

  const sendMessage = () => {
    const newMessage = {
      sender: localStorage.getItem('userId'),
      receiver: userId,
      message,
    };

    socket.emit('sendMessage', newMessage);
    dispatch(addMessage(newMessage));
    setMessage('');
  };

  return (
    <div>
      <h2>Chat</h2>
      <div>
        {messages.map((msg, index) => (
          <p key={index}>
            <b>{msg.sender === localStorage.getItem('userId') ? 'Me' : 'Them'}:</b> {msg.message}
          </p>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message"
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default Chat;
