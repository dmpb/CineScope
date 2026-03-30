type SearchBarProps = {
  defaultValue?: string;
};

export function SearchBar({ defaultValue = "" }: SearchBarProps) {
  return (
    <form action="/search" method="get" className="flex w-full max-w-2xl gap-2">
      <input
        type="search"
        name="q"
        defaultValue={defaultValue}
        placeholder="Busca una pelicula..."
        className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm text-zinc-100 placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none"
      />
      <button
        type="submit"
        className="rounded-lg bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-900 transition hover:bg-zinc-300"
      >
        Buscar
      </button>
    </form>
  );
}
