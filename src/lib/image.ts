import { toJpeg, toPng, toSvg } from "html-to-image";
import { toast } from "sonner";
import React from "react";
import { useTranslation } from "@/lib/i18n";

export enum CaptureTypes {
  PNG = "png",
  JPEG = "jpg",
  SVG = "svg",
}

export type CaptureType =
  | CaptureTypes.PNG
  | CaptureTypes.JPEG
  | CaptureTypes.SVG;
export const defaultCaptureType: CaptureType = CaptureTypes.PNG;
export const captureTypeMethods = {
  [CaptureTypes.PNG]: toPng,
  [CaptureTypes.JPEG]: toJpeg,
  [CaptureTypes.SVG]: toSvg,
};

export async function captureImage(
  filename: string,
  el?: React.RefObject<HTMLElement>,
  type?: CaptureType,
) {
  if (!el || !el.current) {
    return;
  }

  const doCapture = captureTypeMethods[type || defaultCaptureType];
  const dataUrl = await doCapture(el.current);
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = `${filename}.${type || defaultCaptureType}`;
  a.click();
}

export function useImageCapture(el: React.RefObject<HTMLElement>) {
  const { t } = useTranslation();

  return async (filename: string, type?: CaptureType) => {
    try {
      await captureImage(filename, el, type);
      toast.success(t("toast.saved"));
    } catch (e) {
      console.error(e);

      const err = e as Error;
      toast.error(t("toast.save_failed", { message: err.message }));
    }
  };
}
