import { useEffect, useRef } from "react";
import { useAuth } from "@clerk/react";
import { useQueryClient } from "@tanstack/react-query";
import { useSocketStore } from "@/lib/socket";

export const useSocketConnection = (activeChatId?: string) => {
  const { getToken, isSignedIn } = useAuth();
  const queryClient = useQueryClient();

  // select individual actions so this hook doesn't re-render on every
  // presence/typing update
  const socket = useSocketStore((s) => s.socket);
  const connect = useSocketStore((s) => s.connect);
  const disconnect = useSocketStore((s) => s.disconnect);
  const joinChat = useSocketStore((s) => s.joinChat);
  const leaveChat = useSocketStore((s) => s.leaveChat);

  // clerk returns a new getToken identity on most renders - keeping it in a ref
  // means it can't retrigger the connect effect
  const getTokenRef = useRef(getToken);
  getTokenRef.current = getToken;

  // connect socket on mount
  useEffect(() => {
    if (!isSignedIn) {
      disconnect();
      return;
    }

    // connect synchronously: awaiting the token here would let StrictMode's
    // cleanup run before the socket exists, leaking an untracked connection
    connect(() => getTokenRef.current(), queryClient);

    return () => {
      disconnect();
    };
  }, [isSignedIn, connect, disconnect, queryClient]);

  // join/leave chat rooms - if you have a chatid in the url this will run
  useEffect(() => {
    if (!activeChatId || !socket) return;

    joinChat(activeChatId);
    return () => leaveChat(activeChatId);
  }, [activeChatId, socket, joinChat, leaveChat]);
};
