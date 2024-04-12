import { UserDTO } from "parking-sdk";

export type UserContext = {
    currentUser: UserDTO | undefined;
    setCurrentUser: (value: UserDTO | undefined) => void;
  };
  