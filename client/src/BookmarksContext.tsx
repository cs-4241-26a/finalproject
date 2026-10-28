import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { useAuth } from "@clerk/react";

type Bookmark = {
  id: number;
  zip: string;
  place: { city: string; state: string };
};

type BookmarksValue = {
  bookmarks: Bookmark[];
  loading: boolean;
  error: string | null;
  save: (zip: string) => Promise<void>;
  remove: (id: number) => Promise<void>;
  refresh: () => Promise<void>;
};

const Context = createContext<BookmarksValue | null>(null);
const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export function BookmarksProvider({ children }: { children: ReactNode }) {
  const { isLoaded, isSignedIn, userId, getToken } = useAuth();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const request = useCallback(
    async (path = "", options: RequestInit = {}) => {
      const token = await getToken();
      if (!token) throw new Error("Please sign in to save locations.");

      const response = await fetch(`${API}/api/users/saved-searches${path}`, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to update bookmarks.");
      }

      return data;
    },
    [getToken],
  );

  const refresh = useCallback(async () => {
    if (!isSignedIn) return;

    setLoading(true);
    setError(null);

    try {
      setBookmarks(await request());
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load bookmarks.",
      );
    } finally {
      setLoading(false);
    }
  }, [isSignedIn, request]);

  useEffect(() => {
    let active = true;

    setBookmarks([]);
    setError(null);
    setLoading(true);

    if (!isLoaded) return;

    if (!isSignedIn) {
      setLoading(false);
      return;
    }

    request()
      .then((data: Bookmark[]) => {
        if (active) setBookmarks(data);
      })
      .catch((err: unknown) => {
        if (active) {
          setError(
            err instanceof Error ? err.message : "Unable to load bookmarks.",
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [isLoaded, isSignedIn, userId, request]);

  async function save(zip: string) {
    const bookmark: Bookmark = await request("", {
      method: "POST",
      body: JSON.stringify({ zip }),
    });

    setBookmarks((current) => [
      bookmark,
      ...current.filter((item) => item.zip !== bookmark.zip),
    ]);
  }

  async function remove(id: number) {
    await request(`/${id}`, { method: "DELETE" });
    setBookmarks((current) => current.filter((item) => item.id !== id));
  }

  return (
    <Context.Provider
      value={{ bookmarks, loading, error, save, remove, refresh }}
    >
      {children}
    </Context.Provider>
  );
}

export function useBookmarks() {
  const value = useContext(Context);
  if (!value) throw new Error("Missing BookmarksProvider");
  return value;
}
