import {
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { useNavigate } from "react-router";

type Place = {
  city: string;
  state: string;
};

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Search({ compact = false }: { compact?: boolean }) {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<Place[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestionError, setSuggestionError] = useState(false);

  const container = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const id = useId();
  const listId = `${id}-suggestions`;

  useEffect(() => {
    const controller = new AbortController();
    const value = input.trim();

    setSuggestions([]);
    setActive(-1);
    setSuggestionError(false);
    setLoading(false);

    if (!open || value.length < 2) return;

    setLoading(true);

    const timer = window.setTimeout(async () => {
      try {
        const response = await fetch(
          `${API}/api/utilities/suggestions?q=${encodeURIComponent(value)}`,
          { signal: controller.signal },
        );

        if (!response.ok) throw new Error("Suggestions unavailable");

        const places: Place[] = await response.json();

        if (!controller.signal.aborted) {
          setSuggestions(places);
        }
      } catch {
        if (!controller.signal.aborted) setSuggestionError(true);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 250);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [input, open]);

  useEffect(() => {
    function outside(event: PointerEvent) {
      if (!container.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, []);

  function choose(place: Place) {
    const citySearch = `${place.city}, ${place.state}`;

    setOpen(false);
    setActive(-1);
    setError(null);
    setInput(citySearch);

    navigate(`/results/${encodeURIComponent(citySearch)}`);
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (open && active >= 0 && suggestions[active]) {
      choose(suggestions[active]);
      return;
    }

    const value = input.trim();

    if (value.length < 2 || (/^\d+$/.test(value) && !/^\d{5}$/.test(value))) {
      setError("Enter a city name or five-digit ZIP code.");
      return;
    }

    setError(null);
    setOpen(false);
    navigate(`/results/${encodeURIComponent(value)}`);
  }

  function keyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      setOpen(false);
      setActive(-1);
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);

      if (suggestions.length) {
        setActive((value) => (value + 1) % suggestions.length);
      }
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();

      if (suggestions.length) {
        setActive((value) => (value <= 0 ? suggestions.length - 1 : value - 1));
      }
    }
  }

  const showPanel = open && input.trim().length >= 2;

  return (
    <div
      ref={container}
      className="relative w-full max-w-xl text-left"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setOpen(false);
        }
      }}
    >
      <form
        onSubmit={submit}
        className="flex overflow-hidden rounded-lg bg-white shadow-md"
      >
        <label htmlFor={id} className="sr-only">
          City, town, or ZIP code
        </label>

        <input
          id={id}
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={showPanel}
          aria-controls={listId}
          aria-activedescendant={
            showPanel && active >= 0 ? `${id}-option-${active}` : undefined
          }
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          autoComplete="off"
          value={input}
          onChange={(event) => {
            setInput(event.target.value);
            setSuggestions([]);
            setActive(-1);
            setError(null);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={keyDown}
          required
          maxLength={100}
          placeholder={compact ? "City or ZIP code" : "City, town, or ZIP code"}
          className={`min-w-0 flex-1 text-slate-950 placeholder:text-slate-500 focus-within:ring-2 focus-within:ring-teal-600 ${
            compact ? "px-3 py-2 text-sm" : "px-4 py-4"
          }`}
        />

        <button
          type="submit"
          className={`shrink-0 bg-teal-600 font-semibold text-white hover:bg-teal-500 ${
            compact ? "px-3 py-2 text-sm" : "px-5 py-4"
          }`}
        >
          Search
        </button>
      </form>

      {showPanel && (
        <div className="absolute inset-x-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white text-slate-900 shadow-xl">
          <p role="status" className="px-4 py-3 text-sm text-slate-500">
            {loading
              ? "Finding locations…"
              : suggestionError
                ? "Suggestions unavailable. You can still submit your search."
                : suggestions.length
                  ? "Choose a location, or search the whole city."
                  : "No suggestions. Try submitting your search."}
          </p>

          <ul
            id={listId}
            role="listbox"
            aria-label="Suggested locations"
            className="max-h-[min(18rem,40svh)] overflow-y-auto"
          >
            {suggestions.map((place, index) => (
              <li
                id={`${id}-option-${index}`}
                key={`${place.city}:${place.state}`}
                role="option"
                aria-selected={active === index}
                onPointerDown={(event) => event.preventDefault()}
                onMouseEnter={() => setActive(index)}
                onClick={() => choose(place)}
                className={`cursor-pointer px-4 py-3 ${
                  active === index ? "bg-teal-50" : "hover:bg-slate-50"
                }`}
              >
                <span className="block font-medium">
                  {place.city}, {place.state}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-2 rounded-lg bg-white p-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}
    </div>
  );
}
