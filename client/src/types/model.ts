import type { SimpleUser } from "../../../shared/types/User";
import type { SimplePost, Post } from "../../../shared/types/Post";
import type { Message, MessageThread } from "../../../shared/types/Message";

export interface ClientModel {
    currUser?: SimpleUser;

    cachedUsers: Record<string, SimpleUser>;

    currentPost?: Post;

    board?: SimplePost[];

    isAuthenticated: boolean;

    authLoading: boolean;

    messageThreads: MessageThread[];

    currentThread?: MessageThread;

    currentMessages: Message[];
}

export const defaultUser = () : SimpleUser => {
    const defaultUser: SimpleUser = {
        user_id: "",
        display_name: "User",
        residence: "",
        created: ""
    }
    return(defaultUser);
}

export type PostType = "Lost" | "Found";

export const RES_HALLS = [
  "Off-Campus",
  "Commuter",
  "Daniels Hall",
  "Founders Hall",
  "Institute Hall",
  "Messenger Hall",
  "Morgan Hall",
  "Sanford Riley Hall",
  "Stoddard Complex",
  "Ellsworth Apartments",
  "Fuller Apartments",
  "East Hall",
  "Faraday Hall",
  "WPI Townhouses",
  "Cedar House A",
  "Cedar House B",
  "Elbridge House",
  "Fruit House",
  "Hackfeld House",
  "Marston House A",
  "Marston House B",
  "Oak House",
  "Schussler House",
  "Sever House",
  "Trowbridge House",
  "Wachusett House",
  "West House",
  "William House",
  "8 Elbridge House",
  "45 Institute House",
] as const;