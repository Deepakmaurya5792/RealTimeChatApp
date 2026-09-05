import React, { useState, useRef } from 'react';
import { Send, Image, Paperclip, X, Film, Loader } from 'lucide-react';
import useChatStore from '../../zustand/useChatStore';
import axios from 'axios';
import toast from 'react-hot-toast';

const MessageInput = () => {
    const [message, setMessage] = useState('');
    const [media, setMedia] = useState(null); // { file, base64, type: 'image' | 'video', name }
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);
    const { selectedUser, addMessage } = useChatStore();

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Max 25MB file size
        if (file.size > 25 * 1024 * 1024) {
            toast.error('File size must be under 25MB');
            return;
        }

        const isVideo = file.type.startsWith('video/');
        const isImage = file.type.startsWith('image/');

        if (!isImage && !isVideo) {
            toast.error('Please select an image or video file');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setMedia({
                file,
                base64: reader.result,
                type: isVideo ? 'video' : 'image',
                name: file.name
            });
        };
        reader.readAsDataURL(file);
    };

    const removeMedia = () => {
        setMedia(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!message.trim() && !media) return;

        setLoading(true);
        try {
            const payload = {
                message: message.trim(),
                mediaType: media ? media.type : null,
                mediaUrl: media ? media.base64 : null,
            };

            const res = await axios.post(
                `http://localhost:8000/api/messages/send/${selectedUser._id}`,
                payload,
                { withCredentials: true }
            );

            addMessage(res.data);
            setMessage('');
            removeMedia();
        } catch (error) {
            console.error('Error sending message:', error);
            toast.error(error.response?.data?.error || 'Failed to send message');
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return (
        <div className="px-5 py-3 border-t border-white/5 bg-[#0f0f17]">
            {/* Media Preview Box */}
            {media && (
                <div className="mb-3 p-2 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between animate-fade-in">
                    <div className="flex items-center gap-3 overflow-hidden">
                        {media.type === 'image' ? (
                            <img
                                src={media.base64}
                                alt="preview"
                                className="w-12 h-12 object-cover rounded-lg border border-white/10"
                            />
                        ) : (
                            <div className="w-12 h-12 rounded-lg bg-violet-900/40 border border-violet-500/30 flex items-center justify-center text-violet-400">
                                <Film className="w-6 h-6" />
                            </div>
                        )}
                        <div className="truncate">
                            <p className="text-xs font-medium text-slate-200 truncate">{media.name}</p>
                            <span className="text-[10px] text-violet-400 uppercase tracking-wider font-semibold">
                                {media.type}
                            </span>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={removeMedia}
                        className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-all"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            <form onSubmit={handleSubmit} className="flex items-center gap-3">
                {/* File Attachment Input Button */}
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*,video/*"
                    className="hidden"
                />
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-10 h-10 flex-shrink-0 rounded-xl bg-white/5 hover:bg-white/10 border border-white/8 flex items-center justify-center text-slate-400 hover:text-violet-400 transition-all active:scale-95"
                    title="Attach Photo or Video"
                >
                    <Paperclip className="w-4 h-4" />
                </button>

                {/* Text Input */}
                <input
                    type="text"
                    className="flex-1 bg-white/5 border border-white/8 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-violet-500/50 focus:bg-white/8 transition-all"
                    placeholder="Type a message or send media… (Enter to send)"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                />

                {/* Send Button */}
                <button
                    type="submit"
                    disabled={loading || (!message.trim() && !media)}
                    className="w-11 h-11 flex-shrink-0 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-violet-900/40 hover:shadow-violet-700/50 hover:scale-105 active:scale-95"
                >
                    {loading ? <Loader className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
            </form>
        </div>
    );
};

export default MessageInput;
