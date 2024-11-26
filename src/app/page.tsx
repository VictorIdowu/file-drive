"use client";
import { Button } from "@/components/ui/button";
import { useOrganization, useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function Home() {
  const organization = useOrganization();
  const user = useUser();
  let orgId: string | undefined = undefined;
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
  }
  const createFile = useMutation(api.files.createFile);
  const files = useQuery(api.files.getFiles, orgId ? { orgId } : "skip");

  return (
    <main className="flex flex-col min-h-dvh items-center justify-between p-24">
      {files?.map((file) => <div key={file._id}>{file.name}</div>)}

      <Button
        onClick={() => {
          if (!orgId) return;
          createFile({ name: "Text org", orgId: orgId });
        }}
      >
        Click me
      </Button>
    </main>
  );
}
