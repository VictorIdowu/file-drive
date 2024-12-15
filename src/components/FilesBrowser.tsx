"use client";

import SearchBar from "@/components/SearchBar";
import UploadButton from "@/components/UploadButton";
import { useOrganization, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { useState } from "react";
import FileCard from "@/components/FileCard";
import Image from "next/image";
import { GridIcon, Loader2Icon, RowsIcon } from "lucide-react";
import { api } from "../../convex/_generated/api";
import FileTable from "./FileTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  title: string;
  favs?: boolean;
  trashed?: boolean;
}

const options = [
  { val: "all", text: "All" },
  { val: "image", text: "Image" },
  { val: "csv", text: "CSV" },
  { val: "pdf", text: "PDF" },
];

const FilesBrowser = ({ title, favs, trashed }: Props) => {
  const organization = useOrganization();
  const user = useUser();
  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");

  let orgId: string | undefined = undefined;
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
  }
  const files = useQuery(
    api.files.getFiles,
    orgId ? { orgId, type, query, favorites: favs, trashed } : "skip"
  );

  const favorites = useQuery(
    api.files.getAllFavorites,
    orgId ? { orgId } : "skip"
  );

  return (
    <div className="py-8 overflow-hidden flex flex-col">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold pl-10 lg:pl-0">{title}</h1>
        <UploadButton />
      </div>

      <Tabs defaultValue="grid" className="mt-6">
        <SearchBar query={query} setQuery={setQuery} />
        <div className="flex gap-2 justify-between items-center mt-6 mb-2">
          <TabsList>
            <TabsTrigger value="grid" className="flex gap-2">
              <GridIcon size={16} /> Grid
            </TabsTrigger>
            <TabsTrigger value="table" className="flex gap-2">
              <RowsIcon size={16} /> Table
            </TabsTrigger>
          </TabsList>

          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {options.map((opt, i) => (
                <SelectItem key={i} value={opt.val}>
                  {opt.text}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {files ? (
          <>
            <TabsContent className="w-full" value="grid">
              {files?.length > 0 ? (
                <div className="flex flex-col sm:grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                  {files?.map((file) => (
                    <FileCard key={file._id} file={file} favs={favorites} />
                  ))}
                </div>
              ) : (
                <EmptyState favs={favs} trashed={trashed} />
              )}
            </TabsContent>
            <TabsContent value="table">
              {files?.length > 0 ? (
                <FileTable files={files ?? []} favs={favorites} />
              ) : (
                <EmptyState favs={favs} trashed={trashed} />
              )}
            </TabsContent>
          </>
        ) : (
          <div className="h-[60dvh] flex flex-col justify-center items-center text-gray-500">
            <Loader2Icon className="animate-spin" size={50} />
            <p>Loading...</p>
          </div>
        )}
      </Tabs>
    </div>
  );
};

export default FilesBrowser;

const EmptyState = ({
  trashed,
  favs,
}: {
  favs?: boolean;
  trashed?: boolean;
}) => {
  return (
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
  );
};
