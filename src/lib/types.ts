export type User = {
  id: string;
  name: string;
  email: string | null;
  emailVerified?: Date | null;
  image: string;
  type: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
  accounts?: any[];
  sessions?: any[];
  followers?: any[];
  following?: any[];
}

export type Chat = {
  id: string;
  name: string | null;
  creatorId: string | null;
  createdAt: Date;
  updatedAt: Date;
  users?: User[];
  messages?: Message[];
}

export type Message = {
  id: string;
  content?: string | null;
  createdAt: Date;
  updatedAt: Date;
  chat?: Chat;
  user?: User;
}