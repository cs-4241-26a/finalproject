import type { SimpleResponse } from "../../../shared/types/SimpleResponse";
import type { Post, SimplePost } from "../../../shared/types/Post";
import { apiRequest } from "./apiClient";

/**
 * POST /post
 *
 * Creates a new post.
 */
export async function createPost(
    post: Post
): Promise<SimpleResponse<Post>> {
    return apiRequest<SimpleResponse<Post>>(
        "/post",
        {
            method: "POST",
            body: JSON.stringify(post),
        }
    );
}

/**
 * GET /board
 *
 * Retrieves all active posts.
 */
export async function getBoard(): Promise<SimpleResponse<SimplePost[]>> {
    const response = await apiRequest<SimpleResponse<SimplePost[] | Record<string, SimplePost>>>(
        "/board",
        {
            method: "GET",
        }
    );

    const data = response.data;

    if (Array.isArray(data)) {
        return {
            ...response,
            data,
        };
    }

    return {
        ...response,
        data: Object.values(data),
    };
}

/**
 * GET /post/{post_id}
 *
 * Retrieves the full details of a post.
 */
export async function getPost(postId: string): Promise<SimpleResponse<Post>> {
    return apiRequest<SimpleResponse<Post>>(
        `/post/${postId}`,
        {
            method: "GET",
        }
    );
}

/**
 * POST /post/edit
 *
 * Replaces the specified post with the supplied post.
 *
 * The server determines whether the authenticated user owns
 * the post and whether the post is unresolved.
 */
export async function editPost(post: Post): Promise<SimpleResponse<Post>> {
    return apiRequest<SimpleResponse<Post>>(
        "/post/edit",
        {
            method: "POST",
            body: JSON.stringify(post),
        }
    );
}

/**
 * POST /post/resolve/{post_id}
 *
 * Marks a post as resolved/archived.
 */
export async function resolvePost(postId: string): Promise<SimpleResponse<Post>> {
    return apiRequest<SimpleResponse<Post>>(
        `/post/resolve/${postId}`,
        {
            method: "POST",
        }
    );
}

/**
 * DELETE /post/{post_id}
 *
 * Permanently deletes a post.
 */
export async function deletePost(postId: string): Promise<SimpleResponse<SimplePost>> {
    return apiRequest<SimpleResponse<SimplePost>>(
        `/post/${postId}`,
        {
            method: "DELETE",
        }
    );
}