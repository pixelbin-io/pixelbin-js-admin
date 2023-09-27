# Pixelbin Backend SDK for Javascript

Pixelbin Backend SDK for Javascript helps you integrate the core Pixelbin features with your application.

## Getting Started

Getting started with Pixelbin Backend SDK for Javascript

### Installation

```
npm install @pixelbin/admin --save
```

---

### Usage

#### Quick Example

```javascript
// import the PixelbinConfig and PixelbinClient
const { PixelbinConfig, PixelbinClient } = require("@pixelbin/admin");

// Create a config with you API_TOKEN
const config = new PixelbinConfig({
    domain: "https://api.pixelbin.io",
    apiSecret: "API_TOKEN",
});

// Create a pixelbin instance
const pixelbin = new PixelbinClient(config);

async function getData() {
    try {
        // list the assets stored on your organization's Pixelbin Storage
        const explorer = pixelbin.assets.listFilesPaginator({
            onlyFiles: true,
            pageSize: 5,
        });
        while (explorer.hasNext()) {
            const { items, page } = await explorer.next();
            console.log(page.current); // 1
            console.log(page.hasNext); // false
            console.log(page.size); // 3
            console.log(items.length); // 3
        }
    } catch (err) {
        console.log(err);
    }
}

getData();
```

## Security Utils

### For generating Signed URLs

Generate a signed PixelBin url

| Parameter                | Description                                          | Example                                                                                    |
| ------------------------ | ---------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `url` (string)           | A valid Pixelbin URL to be signed                    | `https://cdn.pixelbin.io/v2/dummy-cloudname/original/__playground/playground-default.jpeg` |
| `expirySeconds` (number) | Number of seconds the signed URL should be valid for | `20`                                                                                       |
| `tokenId` (number)       | ID of the token used for signing                     | `42`                                                                                       |
| `token` (string)         | Value of the token used for signing                  | `dummy-token`                                                                              |

Example:

```javascript
const { security } = require("@pixelbin/admin");

const signedUrl = security.signURL(
    "https://cdn.pixelbin.io/v2/dummy-cloudname/original/__playground/playground-default.jpeg", // url
    20, // expirySeconds
    42, // tokenId
    "dummy-token", // token
);
// signedUrl
// https://cdn.pixelbin.io/v2/dummy-cloudname/original/__playground/playground-default.jpeg?pbs=8eb6a00af74e57967a42316e4de238aa88d92961649764fad1832c1bff101f25&pbe=1695635915&pbt=1
```

Usage with custom domain url

```javascript
const { security } = require("@pixelbin/admin");

const signedUrl = security.signURL(
    "https://krit.imagebin.io/v2/original/__playground/playground-default.jpeg", // url
    30, // expirySeconds
    22, // tokenId
    "dummy-token", // token
);
// signedUrl
// https://krit.imagebin.io/v2/original/__playground/playground-default.jpeg?pbs=1aef31c1e0ecd8a875b1d3184f324327f4ab4bce419d81d1eb1a818ee5f2e3eb&pbe=1695705975&pbt=22
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

-   [API docs](documentation/platform/README.md)
