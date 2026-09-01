import { create } from "zustand";
import { io, type Socket } from "socket.io-client";
import type { QueryClient } from "@tanstack/react-query";
import type { IChat, IMessage, IUser } from "@/types";

const SOCKET_URL = import.meta.env.VITE_API_URL;

// clerk tokens are short lived, so we ask for a fresh one on every attempt
type GetToken = () => Promise<string | null>;

type SocketState = {
  socket: Socket | null;
  onlineUsers: Set<string>;
  typingUsers: Map<string, string>; // chatId -> userId
  queryClient: QueryClient | null;
  currentChatId: string | null;
  connect: (getToken: GetToken, queryClient: QueryClient) => void;
  disconnect: () => void;
  joinChat: (chatId: string) => void;
  leaveChat: (chatId: string) => void;
  sendMessage: (chatId: string, text: string, currentUser: IUser) => void;
  setTyping: (chatId: string, isTyping: boolean) => void;
};

export const useSocketStore = create<SocketState>()((set, get) => ({
  socket: null,
  onlineUsers: new Set(),
  typingUsers: new Map(), // chatId -> userId
  queryClient: null,
  currentChatId: null,

  connect: (getToken, queryClient) => {
    const existingSocket = get().socket;
    // `active` covers the handshake and reconnect attempts too - without it a
    // second connect() call tears down a socket that is still connecting
    if (existingSocket?.connected || existingSocket?.active) return;

    const socket = io(SOCKET_URL, {
      // function form: socket.io calls this before *every* connection attempt,
      // so reconnects send a fresh token instead of an expired one
      auth: async (cb) => {
        const token = await getToken();
        cb({ token: token ?? "" });
      },
    });

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);

      // rooms are lost on reconnect, so rejoin the chat we were looking at
      const chatId = get().currentChatId;
      if (chatId) socket.emit("join-chat", chatId);

      // we may have missed events while disconnected
      queryClient.invalidateQueries({ queryKey: ["chats"] });
      if (chatId) {
        queryClient.invalidateQueries({ queryKey: ["messages", chatId] });
      }
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error.message);
    });

    socket.on("socket-error", (error) => {
      console.error("Socket error:", error);

      // the server rejected a send - drop the optimistic messages it refused
      queryClient.setQueriesData<IMessage[]>(
        { queryKey: ["messages"] },
        (old) => old?.filter((m) => !m._id.startsWith("temp-")),
      );
    });

    socket.on("online-users", ({ userIds }) => {
      set({ onlineUsers: new Set<string>(userIds) });
    });

    socket.on("user-online", ({ userId }) => {
      set((state) => ({
        onlineUsers: new Set([...state.onlineUsers, userId]),
      }));
    });

    socket.on("user-offline", ({ userId }) => {
      set((state) => {
        const onlineUsers = new Set(state.onlineUsers);
        onlineUsers.delete(userId);
        return { onlineUsers };
      });
    });

    socket.on("typing", ({ userId, chatId, isTyping }) => {
      set((state) => {
        const typingUsers = new Map(state.typingUsers);
        if (isTyping) typingUsers.set(chatId, userId);
        else typingUsers.delete(chatId);
        return { typingUsers };
      });
    });

    socket.on("new-message", (message) => {
      const senderId = message.sender?._id;

      // update messages in current chat, replacing optimistic messages
      queryClient.setQueryData<IMessage[]>(["messages", message.chat], (old) => {
        if (!old) return [message];
        // remove any optimistic messages (temp IDs) and add the real one
        const filtered = old.filter((m) => !m._id.startsWith("temp-"));
        const exists = filtered.some((m) => m._id === message._id);
        return exists ? filtered : [...filtered, message];
      });

      // update chat's lastMessage directly for instant UI update
      queryClient.setQueryData<IChat[]>(["chats"], (oldChats) => {
        return oldChats?.map((chat) => {
          if (chat._id === message.chat) {
            return {
              ...chat,
              lastMessage: {
                _id: message._id,
                text: message.text,
                sender: senderId,
                createdAt: message.createdAt,
              },
              lastMessageAt: message.createdAt,
            };
          }
          return chat;
        });
      });

      // clear typing indicator when message received
      set((state) => {
        const typingUsers = new Map(state.typingUsers);
        typingUsers.delete(message.chat);
        return { typingUsers };
      });
    });

    set({ socket, queryClient });
  },

  disconnect: () => {
    const socket = get().socket;
    if (socket) {
      socket.removeAllListeners();
      socket.disconnect();
    }
    set({
      socket: null,
      onlineUsers: new Set(),
      typingUsers: new Map(),
      queryClient: null,
      currentChatId: null,
    });
  },

  joinChat: (chatId) => {
    set({ currentChatId: chatId });
    get().socket?.emit("join-chat", chatId);
  },

  leaveChat: (chatId) => {
    if (get().currentChatId === chatId) set({ currentChatId: null });
    get().socket?.emit("leave-chat", chatId);
  },

  sendMessage: (chatId, text, currentUser) => {
    const { socket, queryClient } = get();
    if (!socket?.connected || !queryClient) return;

    // create optimistic message
    const tempId = `temp-${Date.now()}`;
    const optimisticMessage: IMessage = {
      _id: tempId,
      chat: chatId,
      sender: {
        _id: currentUser._id,
        name: currentUser.name,
        email: currentUser.email,
        avatar: currentUser.avatar,
      },
      text,
      createdAt: new Date().toISOString(),
    };

    // add optimistic message immediately
    queryClient.setQueryData<IMessage[]>(["messages", chatId], (old) => {
      if (!old) return [optimisticMessage];
      return [...old, optimisticMessage];
    });

    // emit to server - the server echoes back "new-message", which replaces
    // the optimistic one, and "socket-error" rolls it back
    socket.emit("send-message", { chatId, text });
  },

  setTyping: (chatId, isTyping) => {
    get().socket?.emit("typing", { chatId, isTyping });
  },
}));
