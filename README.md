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

## Utilities

Pixelbin provides url utilities to construct and deconstruct Pixelbin urls.

### urlToObj

Deconstruct a pixelbin url

| parameter            | description          | example                                                                                               |
| -------------------- | -------------------- | ----------------------------------------------------------------------------------------------------- |
| pixelbinUrl (string) | A valid pixelbin url | `https://cdn.pixelbin.io/v2/your-cloud-name/z-slug/t.resize(h:100,w:200)~t.flip()/path/to/image.jpeg` |

**Returns**:

| property                | description                            | example                          |
| ----------------------- | -------------------------------------- | -------------------------------- |
| cloudName (string)      | The cloudname extracted from the url   | `your-cloud-name`                |
| zone (string)           | 6 character zone slug                  | `z-slug`                         |
| version (string)        | cdn api version                        | `v2`                             |
| pattern (string)        | tranformation pattern                  | `t.resize(h:100,w:200)~t.flip()` |
| transformations (array) | Extracted transformations from the url |                                  |
| filePath                | Path to the file on Pixelbin storage   | `/path/to/image.jpeg`            |
| baseUrl (string)        | Base url                               | `https://cdn.pixelbin.io/`       |

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
//     "pattern": "t.resize(h:100,w:200)~t.flip()",
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
//     "baseUrl": "https://cdn.pixelbin.io"
// }
```

### objToUrl

Converts the extracted url obj to a Pixelbin url.

| property                | description                            | example                    |
| ----------------------- | -------------------------------------- | -------------------------- |
| cloudName (string)      | The cloudname extracted from the url   | `your-cloud-name`          |
| zone (string)           | 6 character zone slug                  | `z-slug`                   |
| version (string)        | cdn api version                        | `v2`                       |
| transformations (array) | Extracted transformations from the url |                            |
| filePath                | Path to the file on Pixelbin storage   | `/path/to/image.jpeg`      |
| baseUrl (string)        | Base url                               | `https://cdn.pixelbin.io/` |

```javascript
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
