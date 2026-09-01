export interface IUser {
  _id: string;
  name: string;
  avatar?: string;
  email: string;
}

export interface IChat {
  _id: string;
  participant: IUser;
  lastMessage?: string;
  lastMessageAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMessage {
  _id: string;
  chat: string;
  sender: IUser;
  text: string;
  createdAt: Date;
  updatedAt: Date;
}
