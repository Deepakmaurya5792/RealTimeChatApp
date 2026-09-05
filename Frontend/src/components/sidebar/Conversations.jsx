import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Conversation from './Conversation';
import { Users } from 'lucide-react';

const Conversations = () => {
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const getConversations = async () => {
            setLoading(true);
            try {
                const res = await axios.get('http://localhost:8000/api/users', { withCredentials: true });
                setConversations(res.data);
            } catch (error) {
                console.error('Error fetching conversations:', error);
            } finally {
                setLoading(false);
            }
        };
        getConversations();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col gap-2 px-1 py-2">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-xl animate-pulse">
                        <div className="w-11 h-11 rounded-full bg-white/8 flex-shrink-0" />
                        <div className="flex-1 space-y-2">
                            <div className="h-3 bg-white/8 rounded-full w-3/4" />
                            <div className="h-2.5 bg-white/5 rounded-full w-1/2" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (conversations.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-32 text-slate-600">
                <Users className="w-8 h-8 mb-2 opacity-50" />
                <p className="text-xs">No users found</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col overflow-auto h-full py-1 px-1">
            {conversations.map((conversation) => (
                <Conversation
                    key={conversation._id}
                    conversation={conversation}
                />
            ))}
        </div>
    );
};

export default Conversations;
