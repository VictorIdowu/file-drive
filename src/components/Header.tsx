"use client";

import {
  OrganizationSwitcher,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";
import { Button } from "./ui/button";
import Image from "next/image";
import Link from "next/link";

const Header = () => {
  return (
    <header className="relative z-10 border-b py-4 bg-gray-50">
      <div className="container mx-auto flex justify-between items-center px-6 2xl:px-0">
        <Link href={"/"} className="flex gap-2 items-center">
          <Image
            src="/filedrive-logo.jpg"
            alt="file drive logo"
            width="50"
            height="50"
            className="rounded-full w-10 h-10"
          />
          <p className="text-lg font-medium">FileDrive</p>
        </Link>

        <div className="flex gap-2 items-center">
          <OrganizationSwitcher />
          <UserButton />

          <SignedOut>
            <SignInButton>
              <Button>Sign In</Button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </header>
  );
};

export default Header;
