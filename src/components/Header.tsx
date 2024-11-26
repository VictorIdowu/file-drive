"use client";

import {
  OrganizationSwitcher,
  SignedOut,
  SignInButton,
  UserButton,
  UserProfile,
} from "@clerk/nextjs";
import { Button } from "./ui/button";

const Header = () => {
  return (
    <header className="border-b py-4 bg-gray-50">
      <div className="container mx-auto flex justify-between items-center px-6 2xl:px-0">
        <p>FileDrive</p>

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
