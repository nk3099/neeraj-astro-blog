// links.ts
export type NavLink = {
  href: string;
  label: string;
};

export const links: NavLink[] = [
  { href: "/", label: "home" },
  { href: "/posts", label: "Posts" },
  { href: "/now", label: "Now" },
  { href: "/til", label: "TIL" },
  { href: "/contact", label: "Contact" },
];
