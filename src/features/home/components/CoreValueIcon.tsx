import type { CoreValue } from "../types/home.type";

type CoreValueIconProps = Pick<CoreValue, "iconKey">;

export function CoreValueIcon({ iconKey }: CoreValueIconProps) {
  const icon = {
    heart: (
      <>
        <path d="M40 38c-9-6-17-12-17-20 0-5 3-8 8-8 4 0 7 2 9 6 2-4 5-6 9-6 5 0 8 3 8 8 0 8-8 14-17 20Z" />
        <path d="m23 33-7-7c-2-2-5 0-4 3l9 12m-5-4-7-5c-3-2-5 1-3 4l14 16c4 4 8 5 13 7l7 6 7-6c5-2 9-3 13-7l14-16c2-3 0-6-3-4l-7 5m-5 0 9-12c1-3-2-5-4-3l-7 7" />
        <path d="m26 38-7-6c-3-2-5 1-3 4l10 12m28-10 7-6c3-2 5 1 3 4L54 48M40 65l-8-7c-3-3-4-6-3-9l5-6c2-2 5-2 7 0l5 5 5-5c2-2 5-2 7 0l1 2" />
      </>
    ),
    care: (
      <>
        <path d="M24 20c-7-4-13-1-14 6-1 5 2 11 4 17 2 6 3 17 8 17 4 0 4-9 7-14 2-4 5-4 7 0 3 5 3 14 7 14 5 0 6-11 8-17 2-6 5-12 4-17-1-7-7-10-14-6-5 3-12 3-17 0Z" />
        <path d="M57 33c4 3 9 5 14 5v10c0 9-5 15-14 20-9-5-14-11-14-20V38c5 0 10-2 14-5Z" />
        <path d="m50 49 5 5 9-10M12 8l2 5 5 2-5 2-2 5-2-5-5-2 5-2 2-5Zm-3 33 1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3Z" />
      </>
    ),
    honesty: (
      <>
        <path d="M40 5 51 10v10c0 8-4 14-11 18-7-4-11-10-11-18V10L40 5Z" />
        <path d="m35 20 4 4 7-8" />
        <path d="m6 42 12-9 11 7-9 16-14-6V42Zm68 0-12-9-11 7 9 16 14-6V42Z" />
        <path d="m28 40 8-5 8 3 7-3 10 10-6 8-14-11-5 5c-3 3-7 1-8-1-1-2-1-4 0-6Zm-8 16 10 9c2 2 5 2 7 0l3-3m-13-1 6 5c2 2 5 2 7 0l3-3m-8-11 13 11c2 2 5 2 7-1l2-3" />
      </>
    ),
    innovation: (
      <>
        <circle cx="16" cy="15" r="9" />
        <circle cx="16" cy="15" r="2" />
        <path d="M16 24v33a5 5 0 0 0 10 0V35l-5-6M12 37h13m-13 17h13M39 61V21c0-8 5-13 10-13m-5 0c-3 4-3 8-1 12l3 6v35a4 4 0 0 1-7 2l-3-5" />
        <path d="M59 11c5-2 8-4 11-4l-5 11v40a5 5 0 0 1-10 0V22c0-5 1-8 4-11Zm-4 22h10m-10 8h10m-10 8h10" />
      </>
    ),
  }[iconKey];

  return (
    <svg aria-hidden="true" className="h-16 w-16 fill-none stroke-[#07a6ad]" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 80 80">
      {icon}
    </svg>
  );
}
