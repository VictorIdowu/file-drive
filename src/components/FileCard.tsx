"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Doc } from "../../convex/_generated/dataModel";
import { Button } from "./ui/button";
import {
  FileTextIcon,
  GanttChartIcon,
  HeartIcon,
  ImageIcon,
  MoreVertical,
  TrashIcon,
  UndoIcon,
} from "lucide-react";
import React, { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { Protect } from "@clerk/nextjs";

interface Props {
  file: Doc<"files">;
  favs: Doc<"favorites">[] | undefined;
}

const FileCard = ({ file, favs }: Props) => {
  const typeIcons = {
    image: <ImageIcon />,
    pdf: <FileTextIcon />,
    csv: <GanttChartIcon />,
  } as Record<Doc<"files">["type"], React.ReactNode>;

  const isFavorited = favs
    ? favs.some((fav) => fav.fileId === file._id)
    : false;

  return (
    <Card>
      <CardHeader className="flex flex-row relative">
        <CardTitle className="flex gap-2 items-center">
          <p>{typeIcons[file.type]}</p>
          {file.name}
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
      <CardFooter className="flex justify-center">
        <Button onClick={() => window.open(file.fileId, "_blank")}>
          Download
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FileCard;

const CardActions = ({
  file,
  isFavorited,
}: {
  file: Doc<"files">;
  isFavorited: boolean;
}) => {
  const [showModal, setShowModal] = useState(false);
  const { toast } = useToast();
  const deleteFile = useMutation(api.files.deleteFile);
  const restoreFile = useMutation(api.files.restoreFile);
  const toggleFav = useMutation(api.files.toggleFavorite);

  const handleDelete = async () => {
    try {
      await deleteFile({ fileId: file._id });
      toast({
        variant: "default",
        title: "File marked for deletion!",
        description: "Your file will be deleted soon.",
      });
    } catch (err) {
      console.log(err);
      toast({
        variant: "destructive",
        title: "Something went wrong!",
        description: "File could not be deleted, try again later",
      });
    }
  };
  const handleRestore = async () => {
    try {
      await restoreFile({ fileId: file._id });
      toast({
        variant: "default",
        title: "File restored!",
        description: "Your file has been removed from the deletion queue.",
      });
    } catch (err) {
      console.log(err);
      toast({
        variant: "destructive",
        title: "Something went wrong!",
        description: "File could not be restored, try again later",
      });
    }
  };
  return (
    <>
      <AlertDialog open={showModal} onOpenChange={setShowModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              {file.trashed
                ? "This file will be removed from the deletion queue and restored to your files."
                : "Your file will be moved to the trash and scheduled for deletion."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={file.trashed ? handleRestore : handleDelete}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <MoreVertical />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={() => toggleFav({ fileId: file._id })}
            className="flex gap-2 items-center cursor-pointer"
          >
            {isFavorited ? <HeartIcon fill="#000000" /> : <HeartIcon />}
            {isFavorited ? "Unfavorite" : "Favorite"}
          </DropdownMenuItem>
          <Protect role="org:admin" fallback={<></>}>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => setShowModal(true)}
              className={`flex gap-2 items-center cursor-pointer ${file.trashed ? "text-green-600" : "text-red-600"}`}
            >
              {file.trashed ? <UndoIcon /> : <TrashIcon />}

              {file.trashed ? "Restore" : "Delete"}
            </DropdownMenuItem>
          </Protect>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
