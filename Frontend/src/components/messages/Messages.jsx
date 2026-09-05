import React, { useEffect, useRef } from 'react';
import Message from './Message';
import useChatStore from '../../zustand/useChatStore';
import useSocketStore from '../../zustand/useSocketStore';
import axios from 'axios';

const Messages = () => {
    const { messages, setMessages, selectedUser, addMessage } = useChatStore();
    const { socket } = useSocketStore();
    const lastMessageRef = useRef();

    useEffect(() => {
        const getMessages = async () => {
            try {
                const res = await axios.get(
                    `http://localhost:8000/api/messages/${selectedUser._id}`,
                    { withCredentials: true }
                );
                setMessages(res.data);
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };
        if (selectedUser?._id) getMessages();
    }, [selectedUser?._id, setMessages]);

    useEffect(() => {
        if (!socket) return;
        const handleNewMessage = (newMessage) => {
            if (newMessage.senderId === selectedUser._id) {
                addMessage(newMessage);
            }
        };
        socket.on('newMessage', handleNewMessage);
        return () => socket.off('newMessage', handleNewMessage);
    }, [socket, addMessage, selectedUser]);

    useEffect(() => {
        setTimeout(() => {
            lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    }, [messages]);

    return (
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-1">
            {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-slate-600">
                    <p className="text-sm">No messages yet</p>
                    <p className="text-xs mt-1">Send a message to start the conversation ✨</p>
                </div>
            )}
            {messages.map((message) => (
                <div key={message._id} ref={lastMessageRef}>
                    <Message message={message} />
                </div>
            ))}
        </div>
    );
};

export default Messages;
