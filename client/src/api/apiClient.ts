const API_BASE_URL = (import.meta.env.VITE_API_URL ?? "").replace(/\/+$/, "");

const API_PREFIX = API_BASE_URL ? "" : "/api";

export class ApiError extends Error {
    status: number;

    constructor(status: number, message: string) {
        super(message);
        this.name = "ApiError";
        this.status = status;
    }
}

export async function apiRequest<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const response = await fetch(
        `${API_BASE_URL}${API_PREFIX}${endpoint}`,
        {
            ...options,
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                ...options.headers,
            },
        }
    );

    let body: unknown;

    try {
        body = await response.json();
    } catch {
        body = undefined;
    }

    if (!response.ok) {
        let message = `Request failed with status ${response.status}.`;

        if (
            body &&
            typeof body === "object" &&
            "message" in body &&
            typeof body.message === "string"
        ) {
            message = body.message;
        }

        throw new ApiError(response.status, message);
    }

    return body as T;
}