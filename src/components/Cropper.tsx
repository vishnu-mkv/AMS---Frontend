import { useCallback, useEffect, useState } from "react";
import Cropper from "react-easy-crop";
import { BaseInput } from "./ui/input";
import getCroppedImg from "@/lib/cropImage";
import { Slider } from "./ui/slider";
import { Label } from "./ui/label";

function useImageCropper({
  aspectRatio,
  initial,
}: {
  aspectRatio: number;
  initial?: string;
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [image, setImage] = useState<string>("");
  const [file, setFile] = useState<File>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initial) {
      setImage(initial);
    }

    return () => {
      setFile(undefined);
      setImage("");
      setCroppedImage(null);
      setCroppedAreaPixels(null);
      setRotation(0);
      setZoom(1);
    };
  }, []);

  useEffect(() => {
    if (!file) {
      setImage("");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setImage(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const cropImage = useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(
        image,
        croppedAreaPixels,
        rotation
      );
      setLoading(true);
      setCroppedImage(croppedImage as string);
      setLoading(false);
    } catch (e) {
      console.error(e);
    }
  }, [croppedAreaPixels, rotation]);

  const onCropComplete = useCallback(
    (croppedArea: any, croppedAreaPixels: any) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  let cropper = (
    <div>
      <div className="relative h-[400px] w-full">
        <Cropper
          image={image}
          crop={crop}
          rotation={rotation}
          zoom={zoom}
          aspect={aspectRatio}
          onCropChange={setCrop}
          onRotationChange={setRotation}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
        />

        {!image && (
          <p className="absolute inset-0 bg-gray-100 grid place-items-center">
            No File Choosen
          </p>
        )}
      </div>

      {image && (
        <div className="flex gap-5 flex-wrap">
          <div className="flex grow gap-3 mt-3 items-center">
            <Label className="m-0  min-w-[60px]">Zoom</Label>
            <Slider
              className="grow min-w-[100px]"
              value={[zoom]}
              min={1}
              max={3}
              step={0.1}
              onValueChange={(zoom) => setZoom(zoom[0])}
            />
          </div>
          <div className="flex grow gap-3 mt-3 items-center">
            <Label className="m-0 min-w-[60px]">Rotation</Label>
            <Slider
              className="grow  min-w-[100px]"
              value={[rotation]}
              min={0}
              max={360}
              step={1}
              onValueChange={(rotation) => setRotation(rotation[0])}
            />
          </div>
        </div>
      )}

      <BaseInput
        className="my-5 cursor-pointer"
        type="file"
        accept="image/*"
        onChange={(e) => {
          if (!e.target.files || e.target.files.length === 0) {
            setFile(undefined);
            return;
          }

          let file = e.target.files[0];
          setFile(file);
        }}
      ></BaseInput>
    </div>
  );
  return { cropper, cropImage, croppedImage, file, loading };
}

export default useImageCropper;
