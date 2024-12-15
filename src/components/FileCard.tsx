"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Doc } from "../../convex/_generated/dataModel";
import { formatDistance } from "date-fns";
import { FileTextIcon, GanttChartIcon, ImageIcon } from "lucide-react";
import React from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Image from "next/image";
import CardActions from "./CardActions";

interface Props {
  file: Doc<"files">;
  favs: Doc<"favorites">[] | undefined;
}

const FileCard = ({ file, favs }: Props) => {
  const userProfile = useQuery(api.users.getUserProfile, {
    userId: file.userId,
  });
  const typeIcons = {
    image: <ImageIcon />,
    pdf: <FileTextIcon />,
    csv: <GanttChartIcon />,
  } as Record<Doc<"files">["type"], React.ReactNode>;

  const isFavorited = favs
    ? favs.some((fav) => fav.fileId === file._id)
    : false;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row relative">
        <CardTitle className="flex w-full gap-2 items-center text-base font-normal">
          {typeIcons[file.type]} <p className="w-[90%] truncate">{file.name}</p>
        </CardTitle>
        <div className="absolute top-1 right-2">
          <CardActions file={file} isFavorited={isFavorited} />
        </div>
      </CardHeader>
      <CardContent className="h-[200px] flex justify-center items-center">
        {file.type === "image" && (
          <Image
            src={file.fileId}
            alt=""
            width={1000}
            height={1000}
            className="w-auto h-[130px] object-cover"
          />
        )}
        {file.type === "csv" && <GanttChartIcon size={50} color="#6b7280" />}
        {file.type === "pdf" && <FileTextIcon size={50} color="#6b7280" />}
      </CardContent>
      <CardFooter className="flex items-center text-sm text-gray-700 justify-between gap-2">
        <div className="flex gap-2">
          <Avatar className="w-6 h-6">
            <AvatarImage src={userProfile?.image ?? ""} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          {userProfile?.name ?? ""}
        </div>

        <p>{formatDistance(new Date(file._creationTime), new Date())} ago</p>
      </CardFooter>
    </Card>
  );
};

export default FileCard;
