import React from 'react';
import Sidebar from '../components/sidebar/Sidebar';
import MessageContainer from '../components/messages/MessageContainer';

const Home = () => {
    return (
        <div className="w-full h-screen flex bg-[#0a0a0f] overflow-hidden">
            {/* Left glow */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-96 bg-violet-800/10 rounded-full blur-[100px] pointer-events-none" />
            {/* Right glow */}
            <div className="absolute top-1/4 right-0 w-64 h-96 bg-blue-800/10 rounded-full blur-[100px] pointer-events-none" />
            
            <div className="relative z-10 flex w-full h-full">
                <Sidebar />
                <MessageContainer />
            </div>
        </div>
    );
};

export default Home;
