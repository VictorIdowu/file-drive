"use client";

import { FileIcon, MenuIcon, StarIcon, TrashIcon } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";

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
  {
    name: "Trash",
    url: "/dashboard/trash",
    icon: <TrashIcon size={24} />,
    id: 3,
  },
];

const Sidebar = () => {
  const [showModal, setShowModal] = useState(false);

  const closeModal = () => {
    setShowModal(false);
  };
  return (
    <>
      <Navs className="hidden lg:flex bg-white border-r border-gray-100 lg:min-h-[90dvh]" />
      <Dialog open={showModal} onOpenChange={(isOpen) => setShowModal(isOpen)}>
        <DialogTrigger asChild>
          <MenuIcon
            className="absolute top-9 left-6 lg:hidden cursor-pointer"
            size={32}
          />
        </DialogTrigger>
        <DialogContent className="!left-0 top-0 !bottom-0 min-h-full p-0 translate-x-0 translate-y-0 max-w-[200px]">
          <DialogHeader>
            <DialogTitle>{""}</DialogTitle>
            <DialogDescription>{""}</DialogDescription>
            <Navs className="lg:hidden pl-4" closeModal={closeModal} />
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Sidebar;

const Navs = ({
  className,
  closeModal,
}: {
  className: string;
  closeModal?: () => void;
}) => {
  const pathname = usePathname();
  return (
    <div className={`w-40 flex-col gap-4 pt-8 ${className}`}>
      {navItems.map((nav) => (
        <Link
          key={nav.id}
          href={nav.url}
          onClick={() => closeModal && closeModal()}
        >
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
    </div>
  );
};
