import React, { useState } from 'react';
import useAuthStore from '../../zustand/useAuthStore';
import useChatStore from '../../zustand/useChatStore';
import { X, Play } from 'lucide-react';

const Message = ({ message }) => {
    const { authUser } = useAuthStore();
    const { selectedUser } = useChatStore();
    const [showLightbox, setShowLightbox] = useState(false);
    const fromMe = message.senderId === authUser._id;

    const getAvatarUrl = (user) =>
        user?.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=7c3aed&color=fff&size=80`;

    const timeStr = new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <>
            <div className={`flex items-end gap-2 mb-4 ${fromMe ? 'flex-row-reverse' : 'flex-row'} animate-fade-up`}>
                {/* Avatar */}
                <img
                    src={fromMe ? getAvatarUrl(authUser) : getAvatarUrl(selectedUser)}
                    alt="avatar"
                    className="w-8 h-8 rounded-full object-cover flex-shrink-0 ring-1 ring-white/10"
                />

                {/* Bubble */}
                <div className={`max-w-[70%] group`}>
                    <div
                        className={`p-2.5 rounded-2xl text-sm leading-relaxed break-words overflow-hidden
                            ${fromMe
                                ? 'bg-gradient-to-br from-violet-600 to-indigo-600 text-white rounded-br-sm shadow-lg shadow-violet-900/30'
                                : 'bg-[#1e1e2e] text-slate-200 border border-white/8 rounded-bl-sm'
                            }`}
                    >
                        {/* Media rendering */}
                        {message.mediaType === 'image' && message.mediaUrl && (
                            <div className="mb-2 rounded-xl overflow-hidden cursor-pointer group/img relative border border-white/10 bg-black/20">
                                <img
                                    src={message.mediaUrl}
                                    alt="attachment"
                                    onClick={() => setShowLightbox(true)}
                                    className="max-h-72 w-full object-cover rounded-xl hover:scale-[1.02] transition-all duration-300"
                                />
                            </div>
                        )}

                        {message.mediaType === 'video' && message.mediaUrl && (
                            <div className="mb-2 rounded-xl overflow-hidden border border-white/10 bg-black/40">
                                <video
                                    src={message.mediaUrl}
                                    controls
                                    className="max-h-80 w-full rounded-xl object-contain"
                                />
                            </div>
                        )}

                        {/* Text message */}
                        {message.message && (
                            <p className="px-1 text-sm">{message.message}</p>
                        )}
                    </div>
                    <p className={`text-[10px] text-slate-600 mt-1 ${fromMe ? 'text-right' : 'text-left'} opacity-0 group-hover:opacity-100 transition-opacity`}>
                        {timeStr}
                    </p>
                </div>
            </div>

            {/* Lightbox Image Preview Modal */}
            {showLightbox && message.mediaUrl && (
                <div
                    className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
                    onClick={() => setShowLightbox(false)}
                >
                    <button
                        onClick={() => setShowLightbox(false)}
                        className="absolute top-5 right-5 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all"
                    >
                        <X className="w-6 h-6" />
                    </button>
                    <img
                        src={message.mediaUrl}
                        alt="full size media"
                        className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl border border-white/10"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </>
    );
};

export default Message;
