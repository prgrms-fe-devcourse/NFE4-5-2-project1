export interface MessageType {
  userId: string;
  message: string;
  date: string;
}

export interface Sender {
  _id: string;
  fullName: string;
  username: string;
}

export type MessageMode = "write" | "received" | "sent" | "reply";

export interface MessageProps extends Sender {
  mode: MessageMode;
  sender?: Sender;
  receiver?: Sender;
  seen?: boolean;
  createdAt?: string;
  content?: string;
  message?: string;
}
