import React from 'react';
import { LogOut } from 'lucide-react';
import useAuthStore from '../../zustand/useAuthStore';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
    const setAuthUser = useAuthStore((state) => state.setAuthUser);
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:8000/api/auth/logout', {}, { withCredentials: true });
            localStorage.removeItem('chat-user');
            setAuthUser(null);
            navigate('/login');
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 group border border-transparent hover:border-red-500/20"
        >
            <LogOut className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            <span className="text-sm font-medium">Logout</span>
        </button>
    );
};

export default LogoutButton;
