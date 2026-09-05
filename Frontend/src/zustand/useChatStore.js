import { create } from "zustand";

const useChatStore = create((set) => ({
    selectedUser: null,
    setSelectedUser: (selectedUser) => set({ selectedUser }),
    messages: [],
    setMessages: (messages) => set({ messages }),
    addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
}));

export default useChatStore;
