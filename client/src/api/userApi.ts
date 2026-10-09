import type { SimpleResponse } from "../../../shared/types/SimpleResponse";
import type { SimpleUser, User } from "../../../shared/types/User";
import { apiRequest } from "./apiClient";

/**
 * POST /user
 *
 * Creates a new account.
 *
 * This does Not sign the user in.
 */
export async function createUser(user: User): Promise<SimpleResponse<SimpleUser>> {
    return apiRequest<SimpleResponse<SimpleUser>>(
        "/user",
        {
            method: "POST",
            body: JSON.stringify(user),
        }
    );
}

/**
 * GET /user/{user_id}
 *
 * Retrieves public information about any user.
 *
 * Authentication is required, but the requested user does
 * not have to be the logged-in user.
 */
export async function getUser(userId: string): Promise<SimpleResponse<SimpleUser>> {
    return apiRequest<SimpleResponse<SimpleUser>>(
        `/user/${userId}`,
        {
            method: "GET",
        }
    );
}

/**
 * POST /user/edit
 *
 * Updates the currently authenticated user's information.
 *
 * The server is responsible for ensuring that the submitted
 * user belongs to the authenticated session.
 */
export async function editUser(user: SimpleUser): Promise<SimpleResponse<SimpleUser>> {
    return apiRequest<SimpleResponse<SimpleUser>>(
        "/user/edit",
        {
            method: "POST",
            body: JSON.stringify(user),
        }
    );
}

/**
 * DELETE /user
 *
 * Deletes the currently authenticated user's account.
 */
export async function deleteUser(): Promise<SimpleResponse<SimpleUser>> {
    return apiRequest<SimpleResponse<SimpleUser>>(
        "/user",
        {
            method: "DELETE",
        }
    );
}