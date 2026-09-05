import React, { useEffect } from 'react';
import Messages from './Messages';
import MessageInput from './MessageInput';
import useChatStore from '../../zustand/useChatStore';
import useAuthStore from '../../zustand/useAuthStore';
import useSocketStore from '../../zustand/useSocketStore';
import { MessageSquareDashed, Sparkles } from 'lucide-react';

const MessageContainer = () => {
    const { selectedUser, setSelectedUser } = useChatStore();
    const { onlineUsers } = useSocketStore();

    useEffect(() => {
        return () => setSelectedUser(null);
    }, [setSelectedUser]);

    const getAvatarUrl = (user) =>
        user?.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=7c3aed&color=fff&size=80`;

    return (
        <div className="flex-1 flex flex-col bg-[#0f0f17] overflow-hidden">
            {!selectedUser ? (
                <NoChatSelected />
            ) : (
                <>
                    {/* Chat Header */}
                    <div className="flex items-center gap-3 px-5 py-4 bg-[#111118] border-b border-white/5">
                        <div className="relative">
                            <img
                                src={getAvatarUrl(selectedUser)}
                                alt={selectedUser.name}
                                className="w-10 h-10 rounded-full object-cover ring-2 ring-violet-500/30"
                            />
                            {onlineUsers.includes(selectedUser._id) && (
                                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#111118]"></span>
                            )}
                        </div>
                        <div>
                            <p className="font-semibold text-slate-100 text-sm">{selectedUser.name}</p>
                            <p className="text-xs text-emerald-400">
                                {onlineUsers.includes(selectedUser._id) ? '● Online' : '○ Offline'}
                            </p>
                        </div>
                    </div>

                    {/* Messages */}
                    <Messages />

                    {/* Input */}
                    <MessageInput />
                </>
            )}
        </div>
    );
};

export default MessageContainer;

const NoChatSelected = () => {
    const { authUser } = useAuthStore();
    return (
        <div className="flex-1 flex items-center justify-center">
            <div className="text-center animate-fade-up">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-600/20 to-indigo-600/20 border border-violet-500/20 flex items-center justify-center mx-auto mb-5">
                    <MessageSquareDashed className="w-10 h-10 text-violet-400/60" />
                </div>
                <h3 className="text-lg font-semibold text-slate-300 mb-1">
                    Hey, {authUser?.name?.split(' ')[0]} 👋
                </h3>
                <p className="text-slate-600 text-sm">
                    Select a conversation to start chatting
                </p>
                <div className="flex items-center justify-center gap-1.5 mt-4 text-slate-700 text-xs">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Powered by real-time WebSockets</span>
                </div>
            </div>
        </div>
    );
};
