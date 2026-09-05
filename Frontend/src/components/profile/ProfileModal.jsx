import React, { useState, useRef } from 'react';
import { X, Camera, Edit3, Check, Loader, Mail, AtSign, User } from 'lucide-react';
import useAuthStore from '../../zustand/useAuthStore';
import axios from 'axios';
import toast from 'react-hot-toast';

const ProfileModal = ({ onClose }) => {
    const { authUser, setAuthUser } = useAuthStore();
    const [name, setName] = useState(authUser?.name || '');
    const [username, setUsername] = useState(authUser?.username || '');
    const [previewPic, setPreviewPic] = useState(authUser?.profilePic || '');
    const [base64Pic, setBase64Pic] = useState('');
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef();

    const getAvatarUrl = (user) =>
        user?.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=7c3aed&color=fff&size=200`;

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image must be under 5MB');
            return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewPic(reader.result);
            setBase64Pic(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleSave = async () => {
        if (!name.trim()) return toast.error('Name cannot be empty');
        if (!username.trim()) return toast.error('Username cannot be empty');
        setLoading(true);
        try {
            const payload = { name, username };
            if (base64Pic) payload.profilePic = base64Pic;
            const res = await axios.put('http://localhost:8000/api/users/update-profile', payload, { withCredentials: true });
            const updatedUser = res.data.user;
            localStorage.setItem('chat-user', JSON.stringify(updatedUser));
            setAuthUser(updatedUser);
            toast.success('Profile updated!');
            onClose();
        } catch (err) {
            toast.error(err.response?.data?.error || 'Update failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md" onClick={onClose}>
            <div
                className="bg-[#13131f] border border-white/10 rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-in"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-violet-700 to-indigo-700 px-6 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-white">
                        <Edit3 className="w-4 h-4" />
                        <h2 className="text-base font-bold">Edit Profile</h2>
                    </div>
                    <button onClick={onClose} className="text-white/60 hover:text-white transition-colors rounded-lg p-1 hover:bg-white/10">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6">
                    {/* Avatar */}
                    <div className="flex flex-col items-center mb-6">
                        <div
                            className="relative group cursor-pointer"
                            onClick={() => fileInputRef.current.click()}
                        >
                            <img
                                src={previewPic || getAvatarUrl(authUser)}
                                alt="Profile"
                                className="w-24 h-24 rounded-full object-cover ring-4 ring-violet-500/30 shadow-xl"
                            />
                            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200">
                                <Camera className="w-7 h-7 text-white" />
                            </div>
                            <div className="absolute bottom-0.5 right-0.5 w-7 h-7 bg-violet-600 rounded-full flex items-center justify-center border-2 border-[#13131f] shadow-lg">
                                <Camera className="w-3.5 h-3.5 text-white" />
                            </div>
                        </div>
                        <p className="text-xs text-slate-600 mt-2">Click to change (max 5MB)</p>
                        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                    </div>

                    {/* Fields */}
                    <div className="space-y-4">
                        <div>
                            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                                <User className="w-3.5 h-3.5" /> Full Name
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="input-dark w-full px-4 py-3 rounded-xl text-sm"
                                placeholder="Your full name"
                            />
                        </div>
                        <div>
                            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                                <AtSign className="w-3.5 h-3.5" /> Username
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="input-dark w-full px-4 py-3 rounded-xl text-sm"
                                placeholder="username"
                            />
                        </div>
                        <div>
                            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                                <Mail className="w-3.5 h-3.5" /> Email
                            </label>
                            <input
                                type="email"
                                value={authUser?.email || ''}
                                disabled
                                className="w-full px-4 py-3 rounded-xl text-sm bg-white/3 border border-white/5 text-slate-600 cursor-not-allowed"
                            />
                            <p className="text-[11px] text-slate-700 mt-1">Email cannot be changed</p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 mt-6">
                        <button
                            onClick={onClose}
                            className="flex-1 py-2.5 rounded-xl border border-white/10 text-slate-400 text-sm font-medium hover:bg-white/5 hover:text-slate-200 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50 shadow-lg shadow-violet-900/40"
                        >
                            {loading ? <Loader className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileModal;
