const { BlobServiceClient } = require('@azure/storage-blob');
require('dotenv').config();
const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
;
const CONTAINER_NAME = process.env.AZURE_CONTAINER_NAME;

if (!AZURE_STORAGE_CONNECTION_STRING) {
  throw new Error('Azure Storage connection string is missing in .env');
}

const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);

async function ensureContainerExists() {
  await containerClient.createIfNotExists({ access: 'container' });
}

async function uploadToAzure(file) {
  await ensureContainerExists();

  const sanitizedFileName = file.originalname.replace(/\s+/g, '_');
  const blobName = `${Date.now()}_${sanitizedFileName}`;
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  await blockBlobClient.uploadData(file.buffer, {
    blobHTTPHeaders: { blobContentType: file.mimetype },
  });

  return blockBlobClient.url;
}

module.exports = uploadToAzure;
