import React, { useState } from 'react';
import SearchInput from './SearchInput';
import Conversations from './Conversations';
import LogoutButton from './LogoutButton';
import ProfileModal from '../profile/ProfileModal';
import useAuthStore from '../../zustand/useAuthStore';
import { Pencil, Sparkles } from 'lucide-react';

const Sidebar = () => {
    const { authUser } = useAuthStore();
    const [showProfileModal, setShowProfileModal] = useState(false);

    const getAvatarUrl = (user) =>
        user?.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=7c3aed&color=fff&size=100`;

    return (
        <>
            <div className="w-[300px] h-full flex flex-col bg-[#111118] border-r border-white/5 flex-shrink-0">
                {/* Brand Header */}
                <div className="px-5 pt-5 pb-3">
                    <div className="flex items-center gap-2 mb-5">
                        <Sparkles className="w-5 h-5 text-violet-400" />
                        <span className="font-bold text-lg gradient-text">Chatly</span>
                    </div>

                    {/* Profile Card */}
                    <div
                        className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer transition-all duration-200 group border border-white/5 hover:border-violet-500/30"
                        onClick={() => setShowProfileModal(true)}
                    >
                        <div className="relative flex-shrink-0">
                            <img
                                src={getAvatarUrl(authUser)}
                                alt="My Profile"
                                className="w-10 h-10 rounded-full object-cover ring-2 ring-violet-500/40"
                            />
                            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#111118]"></span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-slate-100 text-sm truncate">{authUser?.name}</p>
                            <p className="text-xs text-slate-500 truncate">@{authUser?.username}</p>
                        </div>
                        <Pencil className="w-3.5 h-3.5 text-slate-600 group-hover:text-violet-400 transition-colors flex-shrink-0" />
                    </div>
                </div>

                {/* Search */}
                <div className="px-5 py-3">
                    <SearchInput />
                </div>

                {/* Section Label */}
                <div className="px-5 pb-2">
                    <p className="text-[11px] font-semibold text-slate-600 uppercase tracking-widest">Messages</p>
                </div>

                {/* Conversations */}
                <div className="flex-1 overflow-hidden px-2">
                    <Conversations />
                </div>

                {/* Logout */}
                <div className="p-4 border-t border-white/5">
                    <LogoutButton />
                </div>
            </div>

            {showProfileModal && (
                <ProfileModal onClose={() => setShowProfileModal(false)} />
            )}
        </>
    );
};

export default Sidebar;
