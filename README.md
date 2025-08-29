# Pixelbin Backend SDK for Javascript

Pixelbin Backend SDK for Javascript helps you integrate the core Pixelbin features with your application.

## Getting Started

Getting started with Pixelbin Backend SDK for Javascript

### Installation

```
npm install @pixelbin/admin --save
```

---

### Initialize client

```javascript
// import the PixelbinConfig and PixelbinClient
const { PixelbinConfig, PixelbinClient } = require("@pixelbin/admin");

// Create a config with you API_TOKEN
const config = new PixelbinConfig({
  domain: "https://api.pixelbin.io",
  apiSecret: "API_TOKEN",
  integrationPlatform: "YourAppName/1.0 (AppPlatform/2.0)", // this is optional
});

// Create a pixelbin instance
const pixelbin = new PixelbinClient(config);
```

Note: You will need an API token to authenticate your requests. Follow the Pixelbin Create Token guide to generate one: [Create Token](https://www.pixelbin.io/docs/tokens/create-token/).

## Predictions API

PixelBin's Prediction APIs offer a suite of smart, AI-powered image editing tools designed to streamline your media workflow. These APIs enable you to transform, organize, and enhance images seamlessly within your application or system.

This SDK offers a convenient wrapper around the Prediction API, allowing developers to easily create, track, and manage prediction jobs using async/await. It simplifies image upload, processing, and retrieval within Node.js applications.

For a broader overview, see the official docs: [Prediction APIs](https://www.pixelbin.io/docs/explore/).

### create

Initiate a prediction job using the prediction model name (for example, `erase_bg`) and input fields as per the model's input schema. Optionally pass a `webhook` URL to receive async notifications.

| Argument | Type   | Required | Description                                          |
| -------- | ------ | -------- | ---------------------------------------------------- |
| name     | string | yes      | Name of the prediction model, e.g. `erase_bg`.       |
| input    | Object | yes      | Input fields as per the model input schema.          |
| webhook  | string | no       | Optional webhook URL to receive async notifications. |

```javascript
const { PixelbinConfig, PixelbinClient } = require("@pixelbin/admin");
const fs = require("fs");

const pixelbin = new PixelbinClient(
  new PixelbinConfig({
    domain: "https://api.pixelbin.io",
    apiSecret: process.env.PIXELBIN_API_TOKEN,
  })
);

const job = await pixelbin.predictions.create({
  name: "erase_bg",
  input: {
    // Provide files as Buffer or Readable stream; URLs are also accepted as strings
    image: fs.readFileSync("/path/to/image.jpeg"),
    industry_type: "general",
    quality_type: "original",
    shadow: "false",
    refine: "true",
  },
  webhook: "https://example.com/webhook",
});

// Job details
console.log(job._id); // Prediction ID
console.log(job.status); // Current job status
console.log(job.urls.get); // URL to fetch job status
```

**returns**: `Promise<Object>`

**On Creation**

| property           | description                       | example                                                                                                                          |
| ------------------ | --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| input (Object)     | Model input                       | `{ "image": "https://delivery.pixelbin.io/predictions/inputs/erase/bg/0198f54a-cc84-7ccc-b31f-18dd0a5b0f01/image/0.jpeg", ... }` |
| status (String)    | Current job status                | `ACCEPTED`                                                                                                                       |
| urls.get (String)  | URL to fetch job details          | `https://api.pixelbin.io/service/platform/transformation/v1.0/predictions/erase--bg--0198f54a-cc84-7ccc-b31f-18dd0a5b0f01`       |
| orgId (Number)     | Organization id                   | `402162`                                                                                                                         |
| retention (String) | Output retention period           | `30d`                                                                                                                            |
| createdAt (String) | Job creation timestamp (ISO 8601) | `2025-08-29T10:06:16.708Z`                                                                                                       |
| \_id (String)      | Prediction request id             | `erase--bg--0198f54a-cc84-7ccc-b31f-18dd0a5b0f01`                                                                                |

**On Error**

| property           | description      | example                                            |
| ------------------ | ---------------- | -------------------------------------------------- |
| message (String)   | Error message    | `Usage Limit Exceeded`                             |
| status (Number)    | HTTP status code | `403`                                              |
| errorCode (String) | Error code       | `JR-1000`                                          |
| exception (String) | Exception name   | `UsageBlockedError`                                |
| info (String)      | Help link        | `https://fynd.engineering/erasebg/docs/error/1000` |

### get

Fetch the prediction by request ID (job.\_id).

| Argument  | Type   | Required | Description                                             |
| --------- | ------ | -------- | ------------------------------------------------------- |
| requestId | string | yes      | Prediction request ID returned by `create` (`job._id`). |

```javascript
const details = await pixelbin.predictions.get(job._id);

if (details.status === "SUCCESS") {
  console.log(details.output);
  // ['https://delivery.pixelbin.io/predictions/outputs/30d/erase/bg/0198a23e-0b1f-7bbd-bc93-29eefb49f2e9/result_0.png']
}
```

**returns**: `Promise<Object>`

**On Success**

| property                 | description                       | example                                                                                                                          |
| ------------------------ | --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| input (Object)           | Model input                       | `{ "image": "https://delivery.pixelbin.io/predictions/inputs/erase/bg/0198f54a-cc84-7ccc-b31f-18dd0a5b0f01/image/0.jpeg", ... }` |
| status (String)          | Final job status                  | `SUCCESS`                                                                                                                        |
| urls.get (String)        | URL to fetch job details          | `https://api.pixelbin.io/service/platform/transformation/v1.0/predictions/erase--bg--0198f54a-cc84-7ccc-b31f-18dd0a5b0f01`       |
| orgId (Number)           | Organization id                   | `402162`                                                                                                                         |
| retention (String)       | Output retention period           | `30d`                                                                                                                            |
| createdAt (String)       | Job creation timestamp (ISO 8601) | `2025-08-29T10:06:16.708Z`                                                                                                       |
| \_id (String)            | Prediction request id             | `erase--bg--0198f54a-cc84-7ccc-b31f-18dd0a5b0f01`                                                                                |
| consumedCredits (Number) | Credits consumed                  | `1`                                                                                                                              |
| output (Array<String>)   | Result URLs                       | `["https://delivery.pixelbin.io/predictions/outputs/30d/erase/bg/0198f54a-cc84-7ccc-b31f-18dd0a5b0f01/result_0.png"]`            |

**On Failure**

| property           | description                       | example                                                                                                                    |
| ------------------ | --------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| input (Object)     | Model input                       | `{ "industry_type": "general", "quality_type": "original", "shadow": false, "refine": true }`                              |
| status (String)    | Final job status                  | `FAILURE`                                                                                                                  |
| urls.get (String)  | URL to fetch job details          | `https://api.pixelbin.io/service/platform/transformation/v1.0/predictions/erase--bg--0198f54b-8d2e-7ccc-b31f-2a2f33cb7365` |
| orgId (Number)     | Organization id                   | `402162`                                                                                                                   |
| retention (String) | Output retention period           | `30d`                                                                                                                      |
| createdAt (String) | Job creation timestamp (ISO 8601) | `2025-08-29T10:07:06.030Z`                                                                                                 |
| \_id (String)      | Prediction request id             | `erase--bg--0198f54b-8d2e-7ccc-b31f-2a2f33cb7365`                                                                          |
| error (String)     | Error message                     | `image not found`                                                                                                          |

### wait

Wait until the prediction completes.

| Argument              | Type   | Required | Description                                                           |
| --------------------- | ------ | -------- | --------------------------------------------------------------------- |
| requestId             | string | yes      | Prediction request ID to poll until status is `SUCCESS` or `FAILURE`. |
| options               | Object | no       | Polling options.                                                      |
| options.maxAttempts   | number | no       | Maximum polling attempts. Default `150`. Range: `1` - `150`.          |
| options.retryFactor   | number | no       | Exponential backoff factor. Default `1`. Range: `1` - `3`.            |
| options.retryInterval | number | no       | Initial wait interval in ms. Default `4000`. Range: `1000` - `60000`. |

```javascript
// default behavior
const result = await pixelbin.predictions.wait(job._id);

// custom behavior
const quick = await pixelbin.predictions.wait(job._id, {
  maxAttempts: 30,
  retryFactor: 1,
  retryInterval: 1000,
});

// Result details
console.log(result.status); // Prediction status
console.log(result.output); // Prediction output
```

**returns**: `Promise<Object>`

See returns for `get` above. `wait` resolves to the final prediction object with the same shape as `get` (either SUCCESS or FAILURE).

### createAndWait

Create a prediction and wait until it completes. Returns the final result.

| Argument | Type   | Required | Description                                                    |
| -------- | ------ | -------- | -------------------------------------------------------------- |
| name     | string | yes      | Prediction name in `plugin_operation` format, e.g. `erase_bg`. |
| input    | Object | yes      | Input fields as per the model input schema.                    |
| webhook  | string | no       | Optional webhook URL.                                          |
| options  | Object | no       | Same options as in `wait`.                                     |

```javascript
const result = await pixelbin.predictions.createAndWait({
  name: "erase_bg",
  input: { image: fs.readFileSync("/path/to/image.jpeg") },
  options: { maxAttempts: 60, retryFactor: 1, retryInterval: 2000 },
});
```

**returns**: `Promise<Object>`

See returns for `get` above. `createAndWait` resolves to the final prediction object with the same shape as `get` (either SUCCESS or FAILURE).

### list

Fetch the list of available prediction models.

```javascript
const items = await pixelbin.predictions.list();
// [ { name: "erase_bg", displayName: "Erase Background", description: "Removes image background.", bannerImage: "..." }, ... ]
```

**returns**: `Promise<Array<Object>>`

**Each item**

| property             | description                               | example                     |
| -------------------- | ----------------------------------------- | --------------------------- |
| name (String)        | Unique identifier of the prediction model | `erase_bg`                  |
| displayName (String) | Human readable name of the model          | `Erase Background`          |
| description (String) | Short model description                   | `Removes image background.` |

### getSchema

Fetch the input schema for a specific prediction model by its name.

| Argument | Type   | Required | Description                       |
| -------- | ------ | -------- | --------------------------------- |
| name     | string | yes      | Prediction name, e.g. `erase_bg`. |

```javascript
const schema = await pixelbin.predictions.getSchema("erase_bg");
// { name: "erase_bg", displayName: "Erase Background", input: { image: { oneOf: [...] }, ... } }
```

**returns**: `Promise<Object>`

| property             | description                                    | example                     |
| -------------------- | ---------------------------------------------- | --------------------------- |
| name (String)        | Model name                                     | `erase_bg`                  |
| displayName (String) | Human readable name                            | `Erase Background`          |
| description (String) | Model description                              | `Removes image background.` |
| input (Object)       | JSON Schema for model inputs (varies by model) | `{ ... }`                   |

Fields inside `input.image` (varies by model):

| property                              | description                                      | example                            |
| ------------------------------------- | ------------------------------------------------ | ---------------------------------- |
| oneOf (Array)                         | Supported input types (e.g., URL or file upload) | `[ ... ]`                          |
| supportedContentTypes (Array<String>) | Supported MIME types                             | `["image/png", "image/jpeg", ...]` |
| imageValidation.maxWidth (Number)     | Max image width in pixels                        | `10000`                            |
| imageValidation.maxHeight (Number)    | Max image height in pixels                       | `10000`                            |
| imageValidation.maxSize (Number)      | Max image size in bytes                          | `26214400`                         |

Notes:

- Pass your raw API token in `apiSecret`. The SDK base64-encodes it for the Authorization header automatically.
- Methods return Promises and are designed for async/await usage.

## Examples

### 1. Implementation using `create`, `get` and `wait` method

```javascript
const { PixelbinConfig, PixelbinClient } = require("@pixelbin/admin");

async function generateImage() {
  const pixelbin = new PixelbinClient(
    new PixelbinConfig({
      domain: "https://api.pixelbin.io",
      apiSecret: process.env.PIXELBIN_API_TOKEN || "API_TOKEN",
    })
  );

  try {
    // 1) Create prediction
    const job = await pixelbin.predictions.create({
      name: "erase_bg",
      input: {
        image:
          "https://cdn.pixelbin.io/v2/dummy-cloudname/original/__playground/playground-default.jpeg",
        industry_type: "general",
        quality_type: "original",
        shadow: false,
        refine: true,
      },
      // webhook: "https://example.com/webhook", // optional
    });
    console.log("Created:", job._id, job.status);

    // 2) get job details
    const details = await pixelbin.predictions.get(job._id);
    console.log("Details:", details.status);

    // 3) Wait for completion
    const result = await pixelbin.predictions.wait(job._id);
    console.log("Final:", result.status, result.output);
  } catch (err) {
    console.error("Error:", err);
  }
}

generateImage();
```

### 2. Implementation with `createAndWait` method

```javascript
const { PixelbinConfig, PixelbinClient } = require("@pixelbin/admin");

async function generateImage() {
  const pixelbin = new PixelbinClient(
    new PixelbinConfig({
      domain: "https://api.pixelbin.io",
      // Use your raw API token; the SDK base64-encodes it automatically
      apiSecret: process.env.PIXELBIN_API_TOKEN || "API_TOKEN",
    })
  );

  try {
    const result = await pixelbin.predictions.createAndWait({
      name: "erase_bg",
      input: {
        image:
          "https://cdn.pixelbin.io/v2/dummy-cloudname/original/__playground/playground-default.jpeg",
        industry_type: "general",
        quality_type: "original",
        shadow: false,
        refine: true,
      },
      // webhook: "https://example.com/webhook", // optional
      options: { maxAttempts: 60, retryFactor: 1, retryInterval: 2000 },
    });

    console.log(result); // { status, output, ... }
  } catch (error) {
    console.error("Error:", error);
  }
}

generateImage();
```

## Uploader

### upload

Uploads a file to PixelBin with greater control over the upload process.

| Argument          | Type                                                                                                          | Required | Description                                                                                                                                                                                                                                           |
| ----------------- | ------------------------------------------------------------------------------------------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| file              | [Buffer](https://nodejs.org/api/buffer.html) or [Stream](https://nodejs.org/api/stream.html#readable-streams) | yes      | The file to be uploaded.                                                                                                                                                                                                                              |
| name              | string                                                                                                        | no       | Name of the file.                                                                                                                                                                                                                                     |
| path              | string                                                                                                        | no       | Path of the containing folder.                                                                                                                                                                                                                        |
| format            | string                                                                                                        | no       | Format of the file.                                                                                                                                                                                                                                   |
| access            | [AccessEnum](./documentation/platform/ASSETS.md#accessenum)                                                   | no       | Access level of the asset, can be either `public-read` or `private`.                                                                                                                                                                                  |
| tags              | [string]                                                                                                      | no       | Tags associated with the file.                                                                                                                                                                                                                        |
| metadata          | string                                                                                                        | no       | Metadata associated with the file.                                                                                                                                                                                                                    |
| overwrite         | boolean                                                                                                       | no       | Overwrite flag. If set to `true`, will overwrite any file that exists with the same path, name, and type. Defaults to `false`.                                                                                                                        |
| filenameOverride  | boolean                                                                                                       | no       | If set to `true`, will add unique characters to the name if an asset with the given name already exists. If the overwrite flag is set to `true`, preference will be given to the overwrite flag. If both are set to `false`, an error will be raised. |
| expiry            | number                                                                                                        | no       | Expiry time in seconds for the underlying signed URL. Defaults to 3000 seconds.                                                                                                                                                                       |
| uploadOptions     | Object                                                                                                        | no       | Additional options for fine-tuning the upload process. Default: `{ chunkSize: 10 * 1024 * 1024, maxRetries: 2, concurrency: 3, exponentialFactor: 2 }`                                                                                                |
| chunkSize         | number                                                                                                        | no       | Size of each chunk to upload. Default is 10 megabyte.                                                                                                                                                                                                 |
| maxRetries        | number                                                                                                        | no       | Maximum number of retries if an upload fails. Default is 2 retries.                                                                                                                                                                                   |
| concurrency       | number                                                                                                        | no       | Number of concurrent chunk upload tasks. Default is 3 concurrent chunk uploads.                                                                                                                                                                       |
| exponentialFactor | number                                                                                                        | no       | The exponential factor for retry delay. Default is 2.                                                                                                                                                                                                 |

**returns**: Promise<Object>

**On Success**

| property             | description                                                     | example                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| -------------------- | --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| orgId (Number)       | Organization id                                                 | `5320086`                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| type (String)        |                                                                 | `file`                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| name (String)        | name of the file                                                | `testfile.jpeg`                                                                                                                                                                                                                                                                                                                                                                                                                            |
| path (String)        | Path of containing folder.                                      | `/path/to/image.jpeg`                                                                                                                                                                                                                                                                                                                                                                                                                      |
| fileId (String)      | id of file                                                      | `testfile.jpeg`                                                                                                                                                                                                                                                                                                                                                                                                                            |
| access (String)      | Access level of asset, can be either `public-read` or `private` | `public-read`                                                                                                                                                                                                                                                                                                                                                                                                                              |
| tags (Array<String>) | Tags associated with the file.                                  | `["tag1", "tag2"]`                                                                                                                                                                                                                                                                                                                                                                                                                         |
| metadata (Object)    | Metadata associated with the file.                              | `{"source:"", "publicUploadId":""}`                                                                                                                                                                                                                                                                                                                                                                                                        |
| format (String)      | file format                                                     | `jpeg`                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| assetType (String)   | type of asset                                                   | `image`                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| size (Number)        | file size                                                       | `37394`                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| width (Number)       | file width                                                      | `720`                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| height (Number)      | file height                                                     | `450`                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| context (Object)     | contains the file metadata and other contexts of file           | `{"steps":[],"req":{"headers":{},"query":{}},"meta":{"format":"png","size":195337,"width":812,"height":500,"space":"srgb","channels":4,"depth":"uchar","density":144,"isProgressive":false,"resolutionUnit":"inch","hasProfile":true,"hasAlpha":true,"extension":"jpeg","contentType":"image/png","assetType":"image","isImageAsset":true,"isAudioAsset":false,"isVideoAsset":false,"isRawAsset":false,"isTransformationSupported":true}}` |
| isOriginal (Boolean) | flag about files type                                           | `true`                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| \_id (String)        | record id                                                       | `a0b0b19a-d526-4xc07-ae51-0xxxxxx`                                                                                                                                                                                                                                                                                                                                                                                                         |
| url (String)         | uploaded image url                                              | `https://cdn.pixelbin.io/v2/user-e26cf3/original/testfile.jpeg`                                                                                                                                                                                                                                                                                                                                                                            |

Example :

#### Uploading a buffer

```javascript
// import the PixelbinConfig and PixelbinClient
const { PixelbinConfig, PixelbinClient } = require("@pixelbin/admin");
const fs = require("fs");

// Create a config with you API_TOKEN
const config = new PixelbinConfig({
    domain: "https://api.pixelbin.io",
    apiSecret: "API_TOKEN",
    integrationPlatform: "YourAppName/1.0 (AppPlatform/2.0)", // this is optional
});

// Create a pixelbin instance
const pixelbin = new PixelbinClient(config);

const buffer = fs.readFileSync("./myimage.png")

const result = await pixelbin.uploader.upload({
  file: buffer,
  name: "myimage",
  path: "folder",
  format: "png",
  tags: [],
  metadata: {},
  overwrite: false,
  filenameOverride: false,
  access: "public-read",
  uploadOptions: {
    chunkSize: 5 * 1024 * 1024 // 5MB
    concurrency: 2, // 2 concurrent chunk uploads
    maxRetries: 1, // 2 retries for errors that can be retried
    exponentialFactor: 1, // exponential factor for retries
  }
});

console.log(result.url)
// "https://cdn.pixelbin.io/v2/mycloudname/original/folder/myimage.png"

```

Example :

#### Uploading a stream

```javascript
// import the PixelbinConfig and PixelbinClient
const { PixelbinConfig, PixelbinClient } = require("@pixelbin/admin");
const fs = require("fs");

// Create a config with you API_TOKEN
const config = new PixelbinConfig({
    domain: "https://api.pixelbin.io",
    apiSecret: "API_TOKEN",
    integrationPlatform: "YourAppName/1.0 (AppPlatform/2.0)", // this is optional
});

// Create a pixelbin instance
const pixelbin = new PixelbinClient(config);

const buffer = fs.createReadStream("./myimage.png")

const result = await pixelbin.uploader.upload({
  file: buffer,
  name: "myimage",
  path: "folder",
  format: "png",
  tags: [],
  metadata: {},
  overwrite: false,
  filenameOverride: false,
  access: "public-read",
  uploadOptions: {
    chunkSize: 5 * 1024 * 1024 // 5MB
    concurrency: 2, // 2 concurrent chunk uploads
    maxRetries: 1, // 2 retries for errors that can be retried
    exponentialFactor: 1, // exponential factor for retries
  }
});

console.log(result.url)
// "https://cdn.pixelbin.io/v2/mycloudname/original/folder/myimage.png"
```

## Integration Platform

The `integrationPlatform` parameter allows you to customize the `User-Agent` string in API requests. This helps in identifying the specific application or plugin making the request, useful for analytics and troubleshooting.

#### How to Use

Include the `integrationPlatform` in your Pixelbin configuration as shown above. The string should clearly identify your application or plugin and include version details as well as any platform your system is deployed on if applicable.

Syntax : `Pixelbin{integration_name}/{integration_version} ({platform_name}/{platform_version})`

## Security Utils

### For generating Signed URLs

Generate a signed PixelBin url

| Parameter                | Description                                          | Example                                                                                    |
| ------------------------ | ---------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `url` (string)           | A valid Pixelbin URL to be signed                    | `https://cdn.pixelbin.io/v2/dummy-cloudname/original/__playground/playground-default.jpeg` |
| `expirySeconds` (number) | Number of seconds the signed URL should be valid for | `20`                                                                                       |
| `accessKey` (string)     | Access key of the token used for signing             | `42`                                                                                       |
| `token` (string)         | Value of the token used for signing                  | `dummy-token`                                                                              |

Example:

```javascript
const { security } = require("@pixelbin/admin");

const signedUrl = security.signURL(
  "https://cdn.pixelbin.io/v2/dummy-cloudname/original/__playground/playground-default.jpeg", // url
  20, // expirySeconds
  "0b55aaff-d7db-45f0-b556-9b45a6f2200e", // accessKey
  "dummy-token" // token
);
// signedUrl
// https://cdn.pixelbin.io/v2/dummy-cloudname/original/__playground/playground-default.jpeg?pbs=8eb6a00af74e57967a42316e4de238aa88d92961649764fad1832c1bff101f25&pbe=1695635915&pbt=0b55aaff-d7db-45f0-b556-9b45a6f2200e
```

Usage with custom domain url

```javascript
const { security } = require("@pixelbin/admin");

const signedUrl = security.signURL(
  "https://krit.imagebin.io/v2/original/__playground/playground-default.jpeg", // url
  30, // expirySeconds
  "0b55aaff-d7db-45f0-b556-9b45a6f2200e", // accessKey
  "dummy-token" // token
);
// signedUrl
// https://krit.imagebin.io/v2/original/__playground/playground-default.jpeg?pbs=1aef31c1e0ecd8a875b1d3184f324327f4ab4bce419d81d1eb1a818ee5f2e3eb&pbe=1695705975&pbt=0b55aaff-d7db-45f0-b556-9b45a6f2200e
```

## URL Utils

Pixelbin provides url utilities to construct and deconstruct Pixelbin urls.

### urlToObj

Deconstruct a pixelbin url

| Parameter             | Description                                                        | Example                                                                                               |
| --------------------- | ------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------- |
| `url` (string)        | A valid Pixelbin URL                                               | `https://cdn.pixelbin.io/v2/your-cloud-name/z-slug/t.resize(h:100,w:200)~t.flip()/path/to/image.jpeg` |
| `opts` (Object)       | Options for the conversion                                         | Default: `{ isCustomDomain: false }`                                                                  |
| `opts.isCustomDomain` | Indicates if the URL belongs to a custom domain (default: `false`) |

**Returns**:

| Property                  | Description                                          | Example                               |
| ------------------------- | ---------------------------------------------------- | ------------------------------------- |
| `baseURL` (string)        | Base path of the URL                                 | `https://cdn.pixelbin.io`             |
| `filePath` (string)       | Path to the file on Pixelbin storage                 | `/path/to/image.jpeg`                 |
| `version` (string)        | Version of the URL                                   | `v2`                                  |
| `cloudName` (string)      | Cloud name from the URL                              | `your-cloud-name`                     |
| `transformations` (array) | A list of transformation objects                     | `[{ "plugin": "t", "name": "flip" }]` |
| `zone` (string)           | Zone slug from the URL                               | `z-slug`                              |
| `pattern` (string)        | Transformation pattern extracted from the URL        | `t.resize(h:100,w:200)~t.flip()`      |
| `worker` (boolean)        | Indicates if the URL is a URL Translation Worker URL | `false`                               |
| `workerPath` (string)     | Input path to a URL Translation Worker               | `resize:w200,h400/folder/image.jpeg`  |
| `options` (Object)        | Query parameters added, such as "dpr" and "f_auto"   | `{ dpr: 2.5, f_auto: true}`           |

Example:

```javascript
const { url } = require("@pixelbin/admin");

const pixelbinUrl =
  "https://cdn.pixelbin.io/v2/your-cloud-name/z-slug/t.resize(h:100,w:200)~t.flip()/path/to/image.jpeg";

const obj = url.urlToObj(pixelbinUrl);
// obj
// {
//     "cloudName": "your-cloud-name",
//     "zone": "z-slug",
//     "version": "v2",
//     "transformations": [
//         {
//             "plugin": "t",
//             "name": "resize",
//             "values": [
//                 {
//                     "key": "h",
//                     "value": "100"
//                 },
//                 {
//                     "key": "w",
//                     "value": "200"
//                 }
//             ]
//         },
//         {
//             "plugin": "t",
//             "name": "flip",
//         }
//     ],
//     "filePath": "path/to/image.jpeg",
//     "baseUrl": "https://cdn.pixelbin.io",
//     "wrkr": false,
//     "workerPath": "",
//     "options": {}
// }
```

```javascript
const { url } = require("@pixelbin/admin");

const customDomainUrl =
  "https://xyz.designify.media/v2/z-slug/t.resize(h:100,w:200)~t.flip()/path/to/image.jpeg";

const obj = url.urlToObj(customDomainUrl, { isCustomDomain: true });
// obj
// {
//     "zone": "z-slug",
//     "version": "v2",
//     "transformations": [
//         {
//             "plugin": "t",
//             "name": "resize",
//             "values": [
//                 {
//                     "key": "h",
//                     "value": "100"
//                 },
//                 {
//                     "key": "w",
//                     "value": "200"
//                 }
//             ]
//         },
//         {
//             "plugin": "t",
//             "name": "flip",
//         }
//     ],
//     "filePath": "path/to/image.jpeg",
//     "baseUrl": "https://xyz.designify.media",
//     "wrkr": false,
//     "workerPath": "",
//     "options": {}
// }
```

```javascript
const { url } = require("@pixelbin/admin");

const workerUrl =
  "https://cdn.pixelbin.io/v2/your-cloud-name/z-slug/wrkr/resize:h100,w:200/folder/image.jpeg";

const obj = url.urlToObj(pixelbinUrl);
// obj
// {
//     "cloudName": "your-cloud-name",
//     "zone": "z-slug",
//     "version": "v2",
//     "transformations": [],
//     "filePath": "",
//     "worker": true,
//     "workerPath": "resize:h100,w:200/folder/image.jpeg",
//     "baseUrl": "https://cdn.pixelbin.io"
//     "options": {}
// }
```

### objToUrl

Converts the extracted url obj to a Pixelbin url.

| Property                   | Description                                          | Example                               |
| -------------------------- | ---------------------------------------------------- | ------------------------------------- |
| `cloudName` (string)       | The cloudname extracted from the URL                 | `your-cloud-name`                     |
| `zone` (string)            | 6 character zone slug                                | `z-slug`                              |
| `version` (string)         | CDN API version                                      | `v2`                                  |
| `transformations` (array)  | Extracted transformations from the URL               | `[{ "plugin": "t", "name": "flip" }]` |
| `filePath` (string)        | Path to the file on Pixelbin storage                 | `/path/to/image.jpeg`                 |
| `baseUrl` (string)         | Base URL                                             | `https://cdn.pixelbin.io/`            |
| `isCustomDomain` (boolean) | Indicates if the URL is for a custom domain          | `false`                               |
| `worker` (boolean)         | Indicates if the URL is a URL Translation Worker URL | `false`                               |
| `workerPath` (string)      | Input path to a URL Translation Worker               | `resize:w200,h400/folder/image.jpeg`  |
| `options` (Object)         | Query parameters added, such as "dpr" and "f_auto"   | `{ "dpr": "2", "f_auto": "true" }`    |

```javascript
const { url } = require("@pixelbin/admin");

const obj = {
  cloudName: "your-cloud-name",
  zone: "z-slug",
  version: "v2",
  transformations: [
    {
      plugin: "t",
      name: "resize",
      values: [
        {
          key: "h",
          value: "100",
        },
        {
          key: "w",
          value: "200",
        },
      ],
    },
    {
      plugin: "t",
      name: "flip",
    },
  ],
  filePath: "path/to/image.jpeg",
  baseUrl: "https://cdn.pixelbin.io",
};
const url = url.objToUrl(obj); // obj is as shown above
// url
// https://cdn.pixelbin.io/v2/your-cloud-name/z-slug/t.resize(h:100,w:200)~t.flip()/path/to/image.jpeg
```

Usage with custom domain

```javascript
const { url } = require("@pixelbin/admin");

const obj = {
  zone: "z-slug",
  version: "v2",
  transformations: [
    {
      plugin: "t",
      name: "resize",
      values: [
        {
          key: "h",
          value: "100",
        },
        {
          key: "w",
          value: "200",
        },
      ],
    },
    {
      plugin: "t",
      name: "flip",
    },
  ],
  filePath: "path/to/image.jpeg",
  baseUrl: "https://xyz.designify.media",
  isCustomDomain: true,
};
const url = url.objToUrl(obj); // obj is as shown above
// url
// https://xyz.designify.media/v2/z-slug/t.resize(h:100,w:200)~t.flip()/path/to/image.jpeg
```

Usage with URL Translation Worker

```javascript
const { url } = require("@pixelbin/admin");

const obj = {
  cloudName: "your-cloud-name",
  zone: "z-slug",
  version: "v2",
  transformations: [],
  filePath: "",
  worker: true,
  workerPath: "resize:h100,w:200/folder/image.jpeg",
  baseUrl: "https://cdn.pixelbin.io",
};
const url = url.objToUrl(obj); // obj is as shown above
// url
// https://cdn.pixelbin.io/v2/your-cloud-name/z-slug/wrkr/resize:h100,w:200/folder/image.jpeg
```

## For Uploading File Buffer

To upload a Buffer, `originalFilename` must be passed in the options object.

```javascript
const { Readable } = require("stream");
const res = await pixelbin.assets.fileUpload({
  file: Readable.from(req.file.buffer),
  name: req.body.name,
  options: { originalFilename: req.file.originalname },
  overwrite: true,
});
```

## Documentation

- [API docs](documentation/platform/README.md)
