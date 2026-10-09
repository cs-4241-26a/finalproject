import type { PostType } from "../../client/src/types/model";

//Post DTOs
export interface SimplePost {
    post_id: string;
    user_id: string;
    userDisplayName: string;
    title: string;
    postType: PostType;
    isResolved: boolean;
    created: string;
    imageData?: string;
}

export interface Post extends SimplePost {
    description: string;
}