import { Show, SignInButton, UserButton } from "@clerk/react";
import { Link, useLocation } from "react-router";
import Logo from "./Logo";
import SearchNav from "./SearchNav";
import BookmarksDropdown from "./BookmarksDropdown";

export default function Navbar() {
  const location = useLocation();
  const isHomepage = location.pathname === "/";

  return (
    <nav
      aria-label="Main navigation"
      className="fixed inset-x-0 top-0 z-40 border-b border-slate-800 bg-slate-950 text-white"
    >
      <div className="flex h-20 w-full items-center justify-between gap-4 px-4 sm:px-6">
        <Link to="/" className="shrink-0 text-lg">
          <Logo />
        </Link>

        {!isHomepage && (
          <div className="ml-4 hidden w-full max-w-md min-w-0 md:block">
            <SearchNav />
          </div>
        )}

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <Show when="signed-out">
            <SignInButton>
              <button
                type="button"
                className="min-h-11 rounded-lg bg-teal-600 px-3 py-2 text-sm font-semibold hover:bg-teal-500 sm:px-4"
              >
                Sign in
              </button>
            </SignInButton>
          </Show>

          <Show when="signed-in">
            <BookmarksDropdown />
            <UserButton
              appearance={{
                elements: {
                  userButtonTrigger: "w-12 h-12 min-w-12 min-h-12",
                  userButtonAvatarBox: "w-12 h-12 min-w-12 min-h-12",
                  userButtonAvatarImg: "w-12 h-12",
                },
              }}
            />
          </Show>
        </div>
      </div>

      {!isHomepage && (
        <div className="px-4 pb-3 md:hidden">
          <SearchNav />
        </div>
      )}
    </nav>
  );
}
