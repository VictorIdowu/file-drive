"use client";
import { useOrganization, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

import UploadButton from "@/components/UploadButton";

export default function Home() {
  const organization = useOrganization();
  const user = useUser();

  let orgId: string | undefined = undefined;
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
  }
  const files = useQuery(api.files.getFiles, orgId ? { orgId } : "skip");

  return (
    <main className="container mx-auto mt-8">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold">My Files</h1>
        <UploadButton />
      </div>
      {files?.map((file) => <div key={file._id}>{file.name}</div>)}
    </main>
  );
}
