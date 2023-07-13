import useImageCropper from "@/components/Cropper";
import { Button } from "@/components/ui/Button";
import { AvatarImage } from "@/components/ui/avatar";
import { AvatarFallback } from "@/components/ui/avatar";
import { Avatar } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { User } from "@/interfaces/user";
import { getInitials } from "@/lib/utils";
import { Close } from "@radix-ui/react-dialog";
import { PencilIcon } from "lucide-react";
import React, { useEffect } from "react";

export interface ImageStore {
  url?: string;
  name?: string;
}

function ImageSelector({
  selectedFile,
  onFileChange,
  user,
}: {
  selectedFile?: ImageStore;
  onFileChange?: (file: ImageStore) => void;
  user?: {
    firstName?: string;
    lastName?: string;
    picture?: string;
  };
}) {
  const { cropper, cropImage, file, croppedImage } = useImageCropper({
    aspectRatio: 1 / 1,
    initial: selectedFile?.url || user?.picture || undefined,
  });
  const [open, setOpen] = React.useState(false);

  async function handleUpdate() {
    await cropImage();
  }

  useEffect(() => {
    if (!onFileChange) return;

    if (croppedImage === selectedFile?.url) return;

    if (!croppedImage || !file) return;

    onFileChange({
      url: croppedImage || undefined,
      name: file?.name,
    });
    if (croppedImage) setOpen(false);
  }, [croppedImage, file]);

  if (!user) return <></>;

  return (
    <div className="">
      <div className="relative mx-auto lg:mx-0 w-52 aspect-square lg:w-[75%]">
        <Avatar className="h-full w-full relative my-10 lg:my-0 lg:mx-auto">
          <AvatarImage src={selectedFile?.url || user?.picture || ""} alt="" />
          <AvatarFallback className="text-xl">
            {getInitials(user?.firstName, user?.lastName)}
          </AvatarFallback>
        </Avatar>
        <Dialog
          open={open}
          onOpenChange={(open) => {
            setOpen(open);
          }}
        >
          <DialogTrigger className="absolute right-0 bottom-3 pointer">
            <PencilIcon className="text-white bg-primary p-1 rounded-full"></PencilIcon>
          </DialogTrigger>
          <DialogContent className="md:max-w-[50vw] space-y-5">
            <DialogTitle>Update Profile Picture</DialogTitle>

            {cropper}
            <div className="flex gap-4 flex-wrap">
              <Close asChild>
                <Button variant="outline" className="grow">
                  Cancel
                </Button>
              </Close>
              <Button onClick={handleUpdate} disabled={!file} className="grow">
                Update Picture
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default ImageSelector;
