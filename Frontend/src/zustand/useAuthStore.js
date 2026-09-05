import { create } from "zustand";

const useAuthStore = create((set) => ({
    authUser: JSON.parse(localStorage.getItem("chat-user")) || null,
    setAuthUser: (user) => set({ authUser: user }),
}));

export default useAuthStore;
