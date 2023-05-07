import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import HTTP_CODES from "http-status-enum";

import { generateReadOnlySASUrl } from "./utils/blobStorage";
import { imageConverter } from "./utils/converter";

const containerName = "app-files";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
) {
  const storageConnectionString = process.env.AzureWebJobsStorage;
  if (!storageConnectionString) {
    context.res.body = `AzureWebJobsStorage env var is not defined - get Storage connection string from Azure portal`;
    context.res.status = HTTP_CODES.BAD_REQUEST;
    return context.res;
  }

  const cosmosConnectionString = process.env.CosmosDbConnectionString;
  if (!cosmosConnectionString) {
    context.res.body = `CosmosDbConnectionString env var is not defined - get Cosmos connection string from Azure portal`;
    context.res.status = HTTP_CODES.BAD_REQUEST;
    return context.res;
  }

  if (!req.query.filename) {
    context.res.body = `Filename query parameter is not defined`;
    context.res.status = HTTP_CODES.BAD_REQUEST;
    return context.res;
  }

  if (
    !req.body ||
    !req.body.image ||
    !req.body.outputFormat ||
    !req.body.inputFormat
  ) {
    context.res = {
      status: HTTP_CODES.BAD_REQUEST,
      body: "Body is malformed",
    };
    return context.res;
  }

  try {
    const convertedImage = await imageConverter({
      image: req.body.image,
      outputFormat: req.body.outputFormat,
      inputFormat: req.body.inputFormat,
    });

    const fileName = `${req.query.filename}.${req.body.outputFormat}`;

    context.log(
      `Filename: ${fileName}, Input format: ${req.body.inputFormat}, Output format: ${req.body.outputFormat}, Image size: ${convertedImage.length}`
    );

    context.bindings.storage = convertedImage;

    const sasInfo = await generateReadOnlySASUrl(
      process.env.AzureWebJobsStorage,
      containerName,
      fileName
    );

    context.bindings.outputDocument = JSON.stringify({
      id: context.bindingData.sys.randGuid,
      created: new Date().toISOString(),
      blobUrl: sasInfo.accountSasTokenUrl,
      fileName,
    });

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
