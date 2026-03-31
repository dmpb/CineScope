import Link from "next/link";
import { SearchBar } from "@/components/SearchBar";

export function Navbar() {
  return (
    <header className="border-b border-zinc-800 bg-zinc-950/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <Link href="/" className="focus-ring w-fit rounded-md text-lg font-semibold tracking-tight text-zinc-100">
          CineScope
        </Link>
        <SearchBar />
      </div>
    </header>
  );
}
