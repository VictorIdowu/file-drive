"use client";

import { FileIcon, StarIcon } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const navItems = [
  {
    name: "All Files",
    url: "/dashboard/files",
    icon: <FileIcon size={24} />,
    id: 1,
  },
  {
    name: "Favorites",
    url: "/dashboard/favorites",
    icon: <StarIcon size={24} />,
    id: 2,
  },
];

const Sidebar = () => {
  const pathname = usePathname();
  return (
    <aside className="w-40 hidden lg:flex flex-col gap-4 bg-white border-r border-gray-100">
      {navItems.map((nav) => (
        <Link key={nav.id} href={nav.url}>
          <Button
            variant={"link"}
            className={clsx("flex gap-2 items-center p-0", {
              "text-blue-500": pathname.includes(nav.url),
            })}
          >
            {nav.icon} {nav.name}
          </Button>
        </Link>
      ))}
    </aside>
  );
};

export default Sidebar;
