//User DTOs
export interface User {
    user_id: string;
    username: string;
    password: string;
    display_name: string;
    residence?: string;
    created: string;
}

export interface SimpleUser {
    user_id: string;
    display_name: string;
    residence?: string;
    created: string;
}