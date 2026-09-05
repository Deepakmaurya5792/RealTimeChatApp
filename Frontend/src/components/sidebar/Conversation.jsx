import React from 'react';
import useChatStore from '../../zustand/useChatStore';
import useSocketStore from '../../zustand/useSocketStore';

const Conversation = ({ conversation, lastIdx }) => {
    const { selectedUser, setSelectedUser } = useChatStore();
    const isSelected = selectedUser?._id === conversation._id;
    const { onlineUsers } = useSocketStore();
    const isOnline = onlineUsers.includes(conversation._id);

    const getAvatarUrl = (user) =>
        user?.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=7c3aed&color=fff&size=80`;

    return (
        <div
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 mb-0.5
                ${isSelected
                    ? 'bg-violet-600/20 border border-violet-500/30'
                    : 'hover:bg-white/5 border border-transparent hover:border-white/8'
                }`}
            onClick={() => setSelectedUser(conversation)}
        >
            {/* Avatar */}
            <div className="relative flex-shrink-0">
                <img
                    src={getAvatarUrl(conversation)}
                    alt={conversation.name}
                    className={`w-11 h-11 rounded-full object-cover transition-all
                        ${isSelected ? 'ring-2 ring-violet-500/60' : 'ring-1 ring-white/10'}
                    `}
                />
                {isOnline && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#111118] shadow-sm"></span>
                )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold truncate ${isSelected ? 'text-violet-200' : 'text-slate-200'}`}>
                    {conversation.name}
                </p>
                <p className="text-xs text-slate-500 truncate">@{conversation.username}</p>
            </div>

            {/* Online badge */}
            {isOnline && (
                <span className="text-[10px] font-medium text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full flex-shrink-0">
                    Online
                </span>
            )}
        </div>
    );
};

export default Conversation;
