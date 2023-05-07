import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import Jimp from "jimp";
import HTTP_CODES from "http-status-enum";
import { generateReadOnlySASUrl } from "./azure-storage-blob-sas-url";

const containerName = "app-files";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
) {
  const storageConnectionString = process.env.AzureWebJobsStorage;
  if (!storageConnectionString) {
    context.res.body = `AzureWebJobsStorage env var is not defined - get Storage Connection string from Azure portal`;
    context.res.status = HTTP_CODES.BAD_REQUEST;
    return context.res;
  }

  const fileName = req.query?.filename;
  if (!fileName) {
    context.res = {
      status: HTTP_CODES.BAD_REQUEST,
      body: "filename is required",
    };
    return context.res;
  }

  if (!req.body || !req.body.image) {
    context.res = {
      status: HTTP_CODES.BAD_REQUEST,
      body: "image property is required",
    };
    return context.res;
  }

  context.log(
    `Filename: ${req.query.filename}, Content type:${req.headers["content-type"]}`
  );

  try {
    const bodyBuffer = Buffer.from(req.body.image, "base64");

    const image = await Jimp.read(bodyBuffer);
    const convertedImage = await image.getBufferAsync(Jimp.MIME_PNG);

    context.bindings.storage = convertedImage;

    const sasInfo = await generateReadOnlySASUrl(
      process.env.AzureWebJobsStorage,
      containerName,
      fileName
    );

    context.res = {
      status: HTTP_CODES.ACCEPTED,
      body: {
        fileName,
        url: sasInfo.accountSasTokenUrl,
      },
    };
  } catch (err) {
    context.log.error(err.message);
    context.res.body = { error: `${err.message}` };
    context.res.status = HTTP_CODES.INTERNAL_SERVER_ERROR;
  }

  return context.res;
};

export default httpTrigger;
