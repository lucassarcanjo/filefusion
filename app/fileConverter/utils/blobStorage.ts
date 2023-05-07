import {
  BlobSASPermissions,
  BlobServiceClient,
  SASProtocol,
} from "@azure/storage-blob";

/**
 * Utility method for generating a secure short-lived SAS URL for a blob.
 * To know more about SAS URLs, see: https://docs.microsoft.com/en-us/azure/storage/common/storage-sas-overview
 * @connectionString connectionString - string
 * @param containerName - string (User's alias)
 * @param filename - string
 */
export const generateReadOnlySASUrl = async (
  connectionString: string,
  containerName: string,
  filename: string
) => {
  // get storage client
  const blobServiceClient =
    BlobServiceClient.fromConnectionString(connectionString);

  // get container client
  const containerClient = blobServiceClient.getContainerClient(containerName);

  // connect to blob client
  const blobClient = containerClient.getBlobClient(filename);

  // Create time limits
  const ONE_DAY = 24 * 60 * 60 * 1000;
  const NOW = new Date();

  // Create SAS URL
  const accountSasTokenUrl = await blobClient.generateSasUrl({
    startsOn: NOW,
    expiresOn: new Date(new Date().valueOf() + ONE_DAY),
    permissions: BlobSASPermissions.parse("r"), // Read only permission to the blob
    protocol: SASProtocol.Https, // Only allow HTTPS access to the blob
  });

  return {
    accountSasTokenUrl,
    storageAccountName: blobClient.accountName,
  };
};
