import Navbar from "../components/Navbar";
import Search from "../components/Search";
import Footer from "../components/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <main>
        <section
          className="mt-20 min-h-[calc(100svh-5rem)] w-full bg-cover bg-top bg-no-repeat px-6 pt-16 pb-24 lg:bg-[length:115%_auto]"
          style={{
            backgroundImage: `linear-gradient(
      to bottom,
      rgba(2, 6, 23, 0) 60%,
      rgba(2, 6, 23, 1) 100%
    ), url('/homepage.jpg')`,
          }}
        >
          <div className="flex flex-col items-center text-center">
            <h1 className="pb-2 text-4xl font-bold sm:text-5xl">
              Welcome to Utilicheck!
            </h1>

            <h2 className="mt-2 max-w-5xl pb-4 text-xl font-medium sm:text-2xl">
              Utilicheck shows you local providers so you can find your best
              option!
            </h2>

            <h3 className="mt-2 pb-4 text-lg font-medium">
              Search for your city, town, or ZIP code!
            </h3>

            <Search />
          </div>
        </section>

        <div className="mx-auto w-full max-w-[1600px] px-6 lg:px-20">
          <section className="grid items-start gap-10 border-b border-slate-800 py-16 md:grid-cols-2 md:gap-20 lg:py-20">
            <div>
              <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
                Find your utility providers.
              </h2>

              <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-300">
                Moving somewhere new? Search your city or ZIP code to find
                providers for the services you need.
              </p>
            </div>

            <ul className="divide-y divide-slate-800 border-y border-slate-800">
              {[
                ["Electricity", "Power for your home"],
                ["Internet", "Get connected"],
                ["Water", "Water and sewer services"],
                ["Gas", "Heating and household gas"],
                ["Trash & recycling", "Local collection services"],
              ].map(([name, description]) => (
                <li
                  key={name}
                  className="flex flex-col gap-1 py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
                >
                  <span className="text-xl font-medium">{name}</span>
                  <span className="text-sm text-slate-400">{description}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="grid items-center gap-10 py-16 md:grid-cols-2 md:gap-20 lg:py-20">
            <div className="md:order-2">
              <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
                Save locations for later.
              </h2>

              <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-300">
                Found a location you want to revisit? Sign in and save it from
                the results page. Your bookmarks stay in the navbar, ready for
                the next time you need them.
              </p>

              <p className="mt-4 text-slate-400">
                You can search without an account.
              </p>
            </div>

            <div className="border-l-2 border-teal-500 pl-6 sm:pl-8 md:order-1">
              <ol className="space-y-8">
                <li>
                  <h3 className="text-xl font-medium">1. Find your location</h3>
                  <p className="mt-2 text-slate-400">
                    Search a city or town, then choose your ZIP code.
                  </p>
                </li>

                <li>
                  <h3 className="text-xl font-medium">2. Save it</h3>
                  <p className="mt-2 text-slate-400">
                    Click “Save location” beside the results heading.
                  </p>
                </li>

                <li>
                  <h3 className="text-xl font-medium">3. Come back anytime</h3>
                  <p className="mt-2 text-slate-400">
                    Open Bookmarks in the navbar to return to your saved
                    locations.
                  </p>
                </li>
              </ol>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
