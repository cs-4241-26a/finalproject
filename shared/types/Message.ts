//Message DTO
export interface Message {
    message_id: string;
    thread_id: string;
    post_id: string;
    sender_id: string;
    senderDisplayName: string;
    recipient_id: string;
    recipientDisplayName: string;
    body: string;
    time: string;
    imageData?: string;
}

export interface MessageThread {
    thread_id: string;
    post_id: string;
    other_user_id: string;
    otherUserDisplayName: string;
}

export interface CreateMessageRequest {
    body: string;
    imageData?: string;
}