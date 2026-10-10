// Small fetch wrapper: sends/receives JSON and throws a readable error
// (using the server's { error } message) when the request fails.
export async function api(method, url, body) {
    const res = await fetch(url, {
        method,
        headers: body ? { "Content-Type": "application/json" } : undefined,
        body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
        let message = `Request failed (${res.status})`;
        try {
            const data = await res.json();
            if (data?.error) message = data.error;
        } catch { /* response had no JSON body */ }
        const err = new Error(message);
        err.status = res.status;
        throw err;
    }

    return res.status === 204 ? null : res.json();
}
