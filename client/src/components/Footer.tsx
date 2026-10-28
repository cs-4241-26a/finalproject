import Logo from "./Logo";

export default function Footer() {
    return(
      <footer className="grid grid-cols-3 items-center justify-center w-full bg-slate-950 p-8 text-white">
        <p className="text-left">
          (Please Don't) Contact Us
        </p>
        <p className="text-slate-500 text-sm text-center">
          No &copy; {new Date().getFullYear()} Utilicheck.
        </p>
        <Logo className="justify-end origin-right"/>
      </footer>
    )
}