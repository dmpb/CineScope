import Image from "next/image";
import Link from "next/link";
import type { UiMessages } from "@/lib/ui-i18n";
import type { PersonSearchHit } from "@/types/movie";

type PersonCardProps = {
  person: PersonSearchHit;
  ui: UiMessages;
};

export function PersonCard({ person, ui }: PersonCardProps) {
  const name = person.name.trim() || ui.untitled;
  const dept = person.knownForDepartment?.trim() || ui.cardPersonDepartmentNA;

  return (
    <article className="relative">
      <Link
        href={`/person/${person.id}`}
        aria-label={ui.cardSeeDetailAria("person", name)}
        className="focus-ring premium-transition group glass-surface-soft block overflow-hidden rounded-xl hover:-translate-y-1 hover:border-zinc-500 hover:shadow-xl hover:shadow-black/40"
      >
        <div className="relative aspect-[2/3] w-full overflow-hidden bg-zinc-800">
          {person.profilePath ? (
            <Image
              src={person.profilePath}
              alt={ui.cardPersonProfileAlt(name)}
              fill
              loading="lazy"
              className="object-cover object-top premium-transition group-hover:scale-[1.06]"
              sizes="(max-width: 640px) 48vw, (max-width: 1024px) 31vw, 20vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center px-3 text-center text-xs text-zinc-400">
              {ui.cardPersonPhotoMissing}
            </div>
          )}
          <div className="pointer-events-none absolute inset-0 rounded-xl shadow-[0_0_0_1px_rgba(59,130,246,0.35),0_0_28px_rgba(59,130,246,0.15)] opacity-0 premium-transition group-hover:opacity-100 group-focus-visible:opacity-100" />
        </div>

        <div className="space-y-1.5 p-3 sm:p-3.5">
          <h3 className="line-clamp-2 text-sm font-medium text-zinc-100 sm:text-base">{name}</h3>
          <p className="text-xs text-zinc-400 sm:text-sm">{dept}</p>
        </div>
      </Link>
    </article>
  );
}
