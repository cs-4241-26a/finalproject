import { useState } from "react";
import { useAuth } from "@clerk/react";
import { Link, useLocation } from "react-router";
import { useBookmarks } from "../BookmarksContext";

export default function SaveLocationButton({ zip }: { zip: string }) {
  const { isLoaded, isSignedIn } = useAuth();
  const { bookmarks, loading, error, save, remove, refresh } = useBookmarks();
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const location = useLocation();

  const bookmark = bookmarks.find((item) => item.zip === zip);
  const returnUrl = location.pathname + location.search;

  async function handleToggle() {
    setBusy(true);
    setActionError(null);

    try {
      if (bookmark) await remove(bookmark.id);
      else await save(zip);
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Unable to update bookmark.",
      );
    } finally {
      setBusy(false);
    }
  }

  if (!isLoaded) return null;

  if (!isSignedIn) {
    return (
      <Link
        to={`/sign-in?redirect_url=${encodeURIComponent(returnUrl)}`}
        className="inline-block rounded-lg bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-600"
      >
        Sign in to save this location
      </Link>
    );
  }

  if (error) {
    return (
      <div>
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
        <button
          type="button"
          onClick={() => void refresh()}
          className="text-sm text-teal-700 underline"
        >
          Retry loading bookmarks
        </button>
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        disabled={loading || busy}
        aria-pressed={Boolean(bookmark)}
        onClick={() => void handleToggle()}
        className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-600 disabled:opacity-50"
      >
        {loading
          ? "Loading bookmarks..."
          : busy
            ? "Updating..."
            : bookmark
              ? "Saved ✓ · Remove"
              : "Save location"}
      </button>

      {actionError && (
        <p role="alert" className="mt-2 text-sm text-red-600">
          {actionError}
        </p>
      )}
    </div>
  );
}
