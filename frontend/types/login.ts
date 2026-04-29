import type { User } from "./common";

export type LoginRequest = {
  username: string;
  password: string;
};

export type LoginResponse = {
  user: User;
};
