import type { SimpleResponse } from "../../../shared/types/SimpleResponse";
import type { Message, MessageThread, CreateMessageRequest } from "../../../shared/types/Message";
import { apiRequest } from "./apiClient";

export async function getThreads(
    postId: string
): Promise<SimpleResponse<MessageThread[]>> {
    return apiRequest<SimpleResponse<MessageThread[]>>(
        `/message/post/${postId}/threads`,
        {
            method: "GET",
        }
    );
}


export async function createThread(
    postId: string
): Promise<SimpleResponse<MessageThread>> {
    return apiRequest<SimpleResponse<MessageThread>>(
        `/message/post/${postId}/thread`,
        {
            method: "POST",
            body: JSON.stringify({
                thread_id: "0",
            }),
        }
    );
}


export async function getThread(
    threadId: string
): Promise<SimpleResponse<Message[]>> {
    return apiRequest<SimpleResponse<Message[]>>(
        `/message/thread/${threadId}`,
        {
            method: "GET",
        }
    );
}

export async function sendMessage(
    threadId: string,
    request: CreateMessageRequest
): Promise<SimpleResponse<Message>> {
    return apiRequest<SimpleResponse<Message>>(
        `/message/thread/${threadId}`,
        {
            method: "POST",
            body: JSON.stringify(request),
        }
    );
}