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
} from "lucide-react";
import React, { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

interface Props {
  file: Doc<"files">;
}

// const getFileUrl = (fileId: string) => {
//   return `${process.env.NEXT_PUBLIC_CONVEX_URL}/api/storage/${fileId}`;
// };

const FileCard = ({ file }: Props) => {
  const typeIcons = {
    image: <ImageIcon />,
    pdf: <FileTextIcon />,
    csv: <GanttChartIcon />,
  } as Record<Doc<"files">["type"], React.ReactNode>;

  return (
    <Card>
      <CardHeader className="flex flex-row relative">
        <CardTitle className="flex gap-2 items-center">
          <p>{typeIcons[file.type]}</p>
          {file.name}
        </CardTitle>
        <div className="absolute top-1 right-2">
          <CardActions file={file} />
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

const CardActions = ({ file }: { file: Doc<"files"> }) => {
  const [showModal, setShowModal] = useState(false);
  const { toast } = useToast();
  const deleteFile = useMutation(api.files.deleteFile);
  const toggleFav = useMutation(api.files.toggleFavorite);

  const handleDelete = async () => {
    try {
      await deleteFile({ fileId: file._id });
      toast({
        variant: "default",
        title: "File Deleted!",
        description: "Your file is now removed from the system.",
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
  return (
    <>
      <AlertDialog open={showModal} onOpenChange={setShowModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              file and remove the data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
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
            <HeartIcon /> Favorite
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setShowModal(true)}
            className="flex gap-2 text-red-600 items-center cursor-pointer"
          >
            <TrashIcon /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
