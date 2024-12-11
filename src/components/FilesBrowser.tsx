"use client";

import SearchBar from "@/components/SearchBar";
import UploadButton from "@/components/UploadButton";
import { useOrganization, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { useState } from "react";
import FileCard from "@/components/FileCard";
import Image from "next/image";
import { Loader2Icon } from "lucide-react";
import { api } from "../../convex/_generated/api";

interface Props {
  title: string;
  favs?: boolean;
  trashed?: boolean;
}

const FilesBrowser = ({ title, favs, trashed }: Props) => {
  const organization = useOrganization();
  const user = useUser();
  const [query, setQuery] = useState("");

  let orgId: string | undefined = undefined;
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
  }
  const files = useQuery(
    api.files.getFiles,
    orgId ? { orgId, query, favorites: favs, trashed } : "skip"
  );

  const favorites = useQuery(
    api.files.getAllFavorites,
    orgId ? { orgId } : "skip"
  );

  return (
    <div className="py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold pl-10 lg:pl-0">{title}</h1>
        <UploadButton />
      </div>
      <SearchBar query={query} setQuery={setQuery} />
      {files ? (
        <>
          {files?.length > 0 ? (
            <div className="mt-8 flex flex-col sm:grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {files?.map((file) => (
                <FileCard key={file._id} file={file} favs={favorites} />
              ))}
            </div>
          ) : (
            <div className="mt-32 flex flex-col gap-8 justify-center items-center">
              <Image
                src={trashed ? "/trash.svg" : "/empty.svg"}
                alt=""
                width={200}
                height={200}
                className=""
              />
              <p className="text-2xl">
                {favs
                  ? "You have not added any file to favorites"
                  : trashed
                    ? "You have no file in trash"
                    : "You have not uploaded any file yet"}
                .
              </p>
              <UploadButton />
            </div>
          )}
        </>
      ) : (
        <div className="h-dvh flex flex-col justify-center items-center text-gray-500">
          <Loader2Icon className="animate-spin" size={50} />
          <p>Loading...</p>
        </div>
      )}
    </div>
  );
};

export default FilesBrowser;
