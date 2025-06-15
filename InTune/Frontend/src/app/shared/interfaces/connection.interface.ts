import { User } from "./user.interface";
//export type ConnectionType = 'amigo' | 'familiar' | 'pareja';

export interface Connection {
  id: number;
  type: 'amigo' | 'familiar' | 'pareja';
  start_date: string | null;
  name:string;
  user: {
    id: number;
    name: string;
    surname: string;
    username: string;
  };
}
