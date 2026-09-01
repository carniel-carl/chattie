export interface IUser {
  _id: string;
  name: string;
  avatar?: string;
  email: string;
}

export interface IChat {
  _id: string;
  participant: IUser;
  lastMessage?: {
    _id: string;
    text: string;
    sender: string;
    createdAt: string;
  };
  lastMessageAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IMessage {
  _id: string;
  chat: string;
  sender: IUser;
  text: string;
  // dates arrive as JSON strings over HTTP/socket, not Date objects
  createdAt: string;
  // absent on optimistic messages that haven't been persisted yet
  updatedAt?: string;
}
