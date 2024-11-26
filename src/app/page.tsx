"use client";
import { Button } from "@/components/ui/button";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
} from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function Home() {
  const createFile = useMutation(api.files.createFile);
  const files = useQuery(api.files.getFiles);
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

      {files?.map((file) => <div key={file._id}>{file.name}</div>)}

      <Button onClick={() => createFile({ name: "Nope" })}>Click me</Button>
    </main>
  );
}
