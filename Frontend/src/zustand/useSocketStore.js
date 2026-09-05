import { create } from "zustand";
import io from "socket.io-client";
import useAuthStore from "./useAuthStore";

const useSocketStore = create((set, get) => ({
    socket: null,
    onlineUsers: [],
    connectSocket: () => {
        const { authUser } = useAuthStore.getState();
        if (!authUser) return;

        const socket = io("http://localhost:8000", {
            query: {
                userId: authUser._id,
            },
        });

        socket.on("connect", () => {
            console.log("Connected to socket server");
        });

        socket.on("getOnlineUsers", (users) => {
            set({ onlineUsers: users });
        });

        set({ socket });
    },
    disconnectSocket: () => {
        const { socket } = get();
        if (socket) {
            socket.close();
            set({ socket: null });
        }
    },
}));

export default useSocketStore;
