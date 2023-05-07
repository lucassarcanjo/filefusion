import Jimp from "jimp";
import z from "zod";
import { Base64 } from "js-base64";

export interface ConverterInput {
  image: string;
  outputFormat: string;
  inputFormat: string;
}

const formatOptions = z.enum(["png", "jpg", "bmp", "tiff", "gif"]);

const converterSchema = z.object({
  image: z.string().refine(Base64.isValid),
  outputFormat: formatOptions,
  inputFormat: formatOptions,
});

export const imageConverter = async ({
  image,
  outputFormat,
  inputFormat,
}: ConverterInput) => {
  const validation = converterSchema.safeParse({
    image,
    outputFormat,
    inputFormat,
  });

  if (!validation.success) {
    throw new Error("Invalid input");
  }

  const bodyBuffer = Buffer.from(image, "base64");

  const jimpImage = await Jimp.read(bodyBuffer);
  const convertedImage = await jimpImage
    .quality(100)
    .getBufferAsync(`image/${outputFormat}`);

  return convertedImage;
};
