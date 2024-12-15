"use client";
import { useState } from "react";
import { Doc } from "../../convex/_generated/dataModel";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
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
import {
  FileIcon,
  HeartIcon,
  MoreVertical,
  TrashIcon,
  UndoIcon,
} from "lucide-react";
import { Protect } from "@clerk/nextjs";

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
  const me = useQuery(api.users.getMe);

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
            onClick={() => window.open(file.fileId, "_blank")}
            className="flex gap-2 items-center cursor-pointer"
          >
            <FileIcon />
            Download
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => toggleFav({ fileId: file._id })}
            className="flex gap-2 items-center cursor-pointer"
          >
            {isFavorited ? <HeartIcon fill="#000000" /> : <HeartIcon />}
            {isFavorited ? "Unfavorite" : "Favorite"}
          </DropdownMenuItem>
          <Protect
            condition={(check) => {
              return (
                check({
                  role: "org:admin",
                }) || file.userId === me?._id
              );
            }}
            fallback={<></>}
          >
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

export default CardActions;
