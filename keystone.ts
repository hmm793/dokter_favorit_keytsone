import { config } from '@keystone-6/core';

import { lists } from './schema';

import { withAuth, session } from './auth';

const {
  // The S3 Bucket Name used to store assets
  S3_BUCKET_NAME: bucketName = 'keystone-test',
  // The region of the S3 bucket
  S3_REGION: region = 'ap-southeast-2',
  // The Access Key ID and Secret that has read/write access to the S3 bucket
  S3_ACCESS_KEY_ID: accessKeyId = 'keystone',
  S3_SECRET_ACCESS_KEY: secretAccessKey = 'keystone',
  // The base URL to serve assets from
  ASSET_BASE_URL: baseUrl = 'http://localhost:3000',
} = process.env;


export default withAuth(
  config({
    db: {
      provider: 'postgresql',
      url: 'postgres://postgres:root@localhost:5432/dokter_favorit_keystone',
      onConnect: async context => { /* ... */ },
      enableLogging: true,
      useMigrations: true,
      idField: { kind: 'uuid' },
      shadowDatabaseUrl: 'postgres://postgres:root@localhost:5432/dokter_favorit_keystone'
    },
    ui: {
      isAccessAllowed: (context) => !!context.session?.data,
    },
    storage: {
      // The key here will be what is referenced in the image field
      my_local_images: {
        // Images that use this store will be stored on the local machine
        kind: 'local',
        // This store is used for the image field type
        type: 'image',
        // The URL that is returned in the Keystone GraphQL API
        generateUrl: path => `${baseUrl}/images${path}`,
        // The route that will be created in Keystone's backend to serve the images
        serverRoute: {
          path: '/images',
        },
        storagePath: 'public/images',
      },
      // The key here will be what is referenced in the file field
      my_s3_files: {
        // Files that use this store will be stored in an s3 bucket
        kind: 's3',
        // This store is used for the file field type
        type: 'file',
        // The S3 bucket name pulled from the S3_BUCKET_NAME environment variable above
        bucketName,
        // The S3 bucket region pulled from the S3_REGION environment variable above
        region,
        // The S3 Access Key ID pulled from the S3_ACCESS_KEY_ID environment variable above
        accessKeyId,
        // The S3 Secret pulled from the S3_SECRET_ACCESS_KEY environment variable above
        secretAccessKey,
        // The S3 links will be signed so they remain private
        signed: { expiry: 5000 },
      },
    },
    lists,
    session,
  })
);
