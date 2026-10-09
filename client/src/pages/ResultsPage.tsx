import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SaveLocationButton from "../components/SaveLocationButton";

type Place = {
  zip: string;
  city: string;
  state: string;
};

type Offering = {
  id: number;
  zip: string;
  category: string;
  price: number | null;
  provider: {
    id: number;
    name: string;
    website: string | null;
    phone: string | null;
  };
};

type UtilityResponse = {
  places: Place[];
  utilities: Record<string, Offering[]>;
};

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const CATEGORY_LABELS: Record<string, string> = {
  ELECTRIC: "Electricity",
  GAS: "Gas",
  WATER: "Water",
  INTERNET: "Internet",
  TRASH: "Trash & recycling",
};

const CATEGORY_ORDER = ["ELECTRIC", "GAS", "WATER", "INTERNET", "TRASH"];

function websiteUrl(value: string | null) {
  if (!value) return null;

  try {
    const url = new URL(
      /^https?:\/\//i.test(value) ? value : `https://${value}`,
    );

    return ["http:", "https:"].includes(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
}

export default function ResultsPage() {
  const { userInput } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const [data, setData] = useState<UtilityResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    setLoading(true);
    setError(null);
    setData(null);

    async function load() {
      try {
        if (!userInput?.trim()) {
          throw new Error("Enter a city or ZIP code.");
        }

        const response = await fetch(
          `${API}/api/utilities/${encodeURIComponent(userInput)}`,
          { signal: controller.signal },
        );

        if (response.status === 404) {
          if (!controller.signal.aborted) {
            setData({ places: [], utilities: {} });
          }
          return;
        }

        const body = await response.json();

        if (!response.ok) {
          throw new Error(body.error || "Unable to load utilities.");
        }

        if (!controller.signal.aborted) {
          setData(body as UtilityResponse);
        }
      } catch (err: unknown) {
        if (!controller.signal.aborted) {
          setError(
            err instanceof Error ? err.message : "Unable to load utilities.",
          );
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    void load();
    return () => controller.abort();
  }, [userInput, retry]);

  const places = [...(data?.places ?? [])].sort((a, b) =>
    a.zip.localeCompare(b.zip),
  );

  const selectedZip =
    searchParams.get("zip") || (places.length === 1 ? places[0].zip : "");

  const selectedPlace = places.find((place) => place.zip === selectedZip);

  const seen = new Set<string>();
  const offerings = Object.values(data?.utilities ?? {})
    .flat()
    .filter((offering) => {
      if (offering.zip !== selectedPlace?.zip) return false;

      const key = `${offering.provider.id}:${offering.category}`;
      if (seen.has(key)) return false;

      seen.add(key);
      return true;
    })
    .sort((a, b) => a.provider.name.localeCompare(b.provider.name));

  const grouped: Record<string, Offering[]> = {};

  for (const offering of offerings) {
    (grouped[offering.category] ??= []).push(offering);
  }

  const categories = [
    ...CATEGORY_ORDER,
    ...Object.keys(grouped).filter(
      (category) => !CATEGORY_ORDER.includes(category),
    ),
  ].filter((category) => grouped[category]?.length);

  function selectZip(zip: string) {
    const next = new URLSearchParams(searchParams);
    if (zip) next.set("zip", zip);
    else next.delete("zip");
    setSearchParams(next);
  }

  return (
    <div className="flex min-h-svh flex-col bg-slate-50 text-slate-900">
      <Navbar />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 pb-12 pt-40 sm:px-6 md:pt-28">
        <Link
          to="/"
          className="mb-6 inline-block text-teal-700 hover:underline"
        >
          &larr; Back to search
        </Link>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold sm:text-4xl">
              {selectedPlace
                ? `Utilities in ${selectedPlace.city}, ${selectedPlace.state}`
                : `Results for ${userInput ?? ""}`}
            </h1>

            {selectedPlace && (
              <p className="mt-2 text-slate-500">
                ZIP code {selectedPlace.zip}
              </p>
            )}
          </div>

          {!loading && !error && selectedPlace && (
            <div className="shrink-0">
              <SaveLocationButton
                key={selectedPlace.zip}
                zip={selectedPlace.zip}
              />
            </div>
          )}
        </div>

        {loading && (
          <p role="status" className="mt-6 text-slate-500">
            Finding local providers…
          </p>
        )}

        {error && (
          <div role="alert" className="mt-6 rounded-xl bg-red-50 p-4">
            <p className="text-red-700">{error}</p>
            <button
              type="button"
              onClick={() => setRetry((value) => value + 1)}
              className="mt-3 font-medium text-red-700 underline"
            >
              Try again
            </button>
          </div>
        )}

        {!loading && !error && places.length === 0 && (
          <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="font-semibold">No matching locations found</h2>
            <p className="mt-2 text-slate-500">
              Try a ZIP code or a city with its state, such as Worcester, MA.
              Results are limited to locations in our database.
            </p>
          </div>
        )}

        {!loading && !error && places.length > 0 && (
          <>
            <div className="my-6 w-full max-w-md">
              <label
                htmlFor="results-zip"
                className="mb-2 block text-sm font-semibold"
              >
                Choose a location by ZIP code
              </label>

              <select
                id="results-zip"
                value={selectedPlace?.zip ?? ""}
                onChange={(event) => selectZip(event.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white p-3"
              >
                <option value="">Select a location</option>

                {places.map((place) => (
                  <option key={place.zip} value={place.zip}>
                    {place.zip} — {place.city}, {place.state}
                  </option>
                ))}
              </select>
            </div>

            {!selectedPlace && (
              <p className="text-slate-500">
                Choose a ZIP code to see its providers and save that location.
              </p>
            )}

            {selectedPlace && offerings.length === 0 && (
              <p className="rounded-xl bg-white p-6 text-slate-500">
                This location is in our database, but no utility providers have
                been listed for it yet.
              </p>
            )}

            {selectedPlace &&
              categories.map((category) => (
                <section key={category} className="mb-8">
                  <div className="mb-4 flex items-center gap-3">
                    <h2 className="text-2xl font-semibold">
                      {CATEGORY_LABELS[category] ?? category}
                    </h2>
                    <span className="rounded-full bg-teal-100 px-3 py-1 text-sm text-teal-800">
                      {grouped[category].length}{" "}
                      {grouped[category].length === 1
                        ? "provider"
                        : "providers"}
                    </span>
                  </div>

                  <div
                    className={`grid gap-4 ${
                      grouped[category].length > 1 ? "sm:grid-cols-2" : ""
                    }`}
                  >
                    {grouped[category].map((offering) => {
                      const website = websiteUrl(offering.provider.website);

                      return (
                        <article
                          key={offering.id}
                          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
                        >
                          <h3 className="text-xl font-semibold">
                            {offering.provider.name}
                          </h3>
                          <p className="mt-2 text-sm text-slate-500">
                            Available in ZIP {selectedPlace.zip}
                          </p>

                          <p className="mt-3 text-sm">
                            {offering.price !== null
                              ? `Listed price: ${new Intl.NumberFormat(
                                  "en-US",
                                  {
                                    style: "currency",
                                    currency: "USD",
                                  },
                                ).format(offering.price)}`
                              : "Contact provider for pricing"}
                          </p>

                          <div className="mt-4 flex flex-wrap gap-4 text-sm font-medium text-teal-700">
                            {website && (
                              <a
                                href={website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:underline"
                              >
                                Visit website
                              </a>
                            )}
                            {offering.provider.phone && (
                              <a
                                href={`tel:${offering.provider.phone.replace(
                                  /[^\d+]/g,
                                  "",
                                )}`}
                                className="hover:underline"
                              >
                                {offering.provider.phone}
                              </a>
                            )}
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </section>
              ))}

            {selectedPlace && offerings.length > 0 && (
              <p className="text-sm text-slate-500">
                Confirm availability and current pricing directly with the
                provider.
              </p>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
