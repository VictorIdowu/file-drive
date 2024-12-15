"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Doc } from "../../convex/_generated/dataModel";
import { formatDistance } from "date-fns";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import CardActions from "./CardActions";

interface Props {
  files: Doc<"files">[];
  favs: Doc<"favorites">[] | undefined;
}

const FileTable = ({ files, favs }: Props) => {
  return (
    <section className="overflow-hidden">
      <Table className="min-w-[800px]">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="text-center">Created by</TableHead>
            <TableHead className="">Uploaded</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {files.map((file: Doc<"files">) => (
            <TablesRow file={file} favs={favs} key={file._id} />
          ))}
        </TableBody>
      </Table>
    </section>
  );
};

export default FileTable;

const TablesRow = ({
  file,
  favs,
}: {
  file: Doc<"files">;
  favs: Doc<"favorites">[] | undefined;
}) => {
  const userProfile = useQuery(api.users.getUserProfile, {
    userId: file.userId,
  });

  const isFavorited = favs
    ? favs.some((fav) => fav.fileId === file._id)
    : false;

  return (
    <TableRow>
      <TableCell className="font-medium max-w-[300px] truncate">
        {file.name}
      </TableCell>
      <TableCell className="capitalize">{file.type}</TableCell>
      <TableCell className="flex gap-2 items-center justify-center">
        <Avatar className="w-6 h-6">
          <AvatarImage src={userProfile?.image ?? ""} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        {userProfile?.name ?? ""}
      </TableCell>
      <TableCell className="">
        {formatDistance(new Date(file._creationTime), new Date())} ago
      </TableCell>
      <TableCell className="text-right">
        <CardActions file={file} isFavorited={isFavorited} />
      </TableCell>
    </TableRow>
  );
};
