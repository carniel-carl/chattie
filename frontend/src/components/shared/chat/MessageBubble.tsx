import { formatTime } from "@/lib/utils";

//eslint-disable-next-line @typescript-eslint/no-explicit-any
export function MessageBubble({ message, currentUser }: any) {
  const isMe = message.sender?._id === currentUser?._id;

  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-md px-4 py-2.5 rounded-2xl ${
          isMe
            ? "bg-linear-to-r from-lime-800 to-teal-800 "
            : "bg-teal-800/20 text-base-content"
        }`}
      >
        <p className="text-sm">{message.text}</p>
        <p
          className={`text-xs mt-1 ${isMe ? "text-foreground" : "text-muted-foreground"}`}
        >
          {formatTime(message.createdAt)}
        </p>
      </div>
    </div>
  );
}
