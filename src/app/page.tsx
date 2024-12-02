"use client";
import { useOrganization, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

import UploadButton from "@/components/UploadButton";
import FileCard from "@/components/FileCard";
import Image from "next/image";
import { Loader2Icon } from "lucide-react";

export default function Home() {
  const organization = useOrganization();
  const user = useUser();

  let orgId: string | undefined = undefined;
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
  }
  const files = useQuery(api.files.getFiles, orgId ? { orgId } : "skip");

  return (
    <main className="container mx-auto my-8 px-6">
      {files && files?.length > 0 ? (
        <>
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold">My Files</h1>
            <UploadButton />
          </div>
          <div className="mt-8 flex flex-col sm:grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {files?.map((file) => <FileCard key={file._id} file={file} />)}
          </div>
        </>
      ) : files?.length === 0 ? (
        <div className="mt-32 flex flex-col gap-8 justify-center items-center">
          <Image
            src={"/empty.svg"}
            alt=""
            width={200}
            height={200}
            className=""
          />
          <p className="text-2xl">You have not uploaded any file yet.</p>
          <UploadButton />
        </div>
      ) : (
        <div className="h-dvh flex flex-col justify-center items-center text-gray-500">
          <Loader2Icon className="animate-spin" size={50} />
          <p>Loading...</p>
        </div>
      )}
    </main>
  );
}
