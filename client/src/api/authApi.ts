import type { SimpleResponse } from "../../../shared/types/SimpleResponse";
import type { SimpleUser } from "../../../shared/types/User";
import { apiRequest } from "./apiClient";

export interface LoginCredentials {
    username: string;
    password: string;
}

/**
 * POST /auth/login
 *
 * The server sets the HttpOnly sessionToken cookie.
 * JavaScript never receives or stores the token.
 */
export async function login(username: string, password: string): Promise<SimpleResponse<SimpleUser>> {
    return apiRequest<SimpleResponse<SimpleUser>>(
        "/auth/login",
        {
            method: "POST",
            body: JSON.stringify({
                username,
                password,
            }),
        }
    );
}

/**
 * GET /auth/logout
 *
 * The server invalidates the session and should expire
 * the sessionToken cookie.
 */
export async function logout(): Promise<SimpleResponse<{}>> {
    return apiRequest<SimpleResponse<{}>>(
        "/auth/logout",
        {
            method: "GET",
        }
    );
}

/**
 * GET /auth/me
 *
 * The server examines the sessionToken cookie and returns
 * the currently authenticated user.
 */
export async function getCurrentUser(): Promise<SimpleResponse<SimpleUser>> {
    return apiRequest<SimpleResponse<SimpleUser>>(
        "/auth/me",
        {
            method: "GET",
        }
    );
}