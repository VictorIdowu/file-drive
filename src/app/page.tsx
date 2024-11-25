"use client";
import { Button } from "@/components/ui/button";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
} from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function Home() {
  const createFile = useMutation(api.files.createFile);
  return (
    <main className="flex flex-col min-h-dvh items-center justify-between p-24">
      <SignedIn>
        <SignInButton>
          <Button>Sign Out</Button>
        </SignInButton>
      </SignedIn>
      <SignedOut>
        <SignOutButton>
          <Button>Sign In</Button>
        </SignOutButton>
      </SignedOut>

      <Button onClick={() => createFile({ name: "Howfar" })}>Click me</Button>
    </main>
  );
}
