import Jimp from "jimp";
import z from "zod";
import { Base64 } from "js-base64";

export interface ConverterInput {
  image: string;
  outputFormat: string;
}

const formatOptions = z.enum([
  "image/png",
  "image/jpeg",
  "image/bmp",
  "image/tiff",
  "image/gif",
]);

const converterSchema = z.object({
  image: z.string().refine(Base64.isValid),
  outputFormat: formatOptions,
});

export const imageConverter = async ({
  image,
  outputFormat,
}: ConverterInput) => {
  const validation = converterSchema.safeParse({
    image,
    outputFormat,
  });

  if (!validation.success) {
    throw new Error("Invalid input");
  }

  const bodyBuffer = Buffer.from(image, "base64");

  const jimpImage = await Jimp.read(bodyBuffer);
  const convertedImage = await jimpImage
    .quality(100)
    .getBufferAsync(outputFormat);

  return convertedImage;
};
