##### [Back to Pixelbin API docs](./README.md)

## Assets Methods

Asset Uploader Service

-   [fileUpload](#fileupload)
-   [urlUpload](#urlupload)
-   [createSignedUrl](#createsignedurl)
-   [listFiles](#listfiles)
-   [listFilesPaginator](#listfilespaginator)
-   [getFileById](#getfilebyid)
-   [getFileByFileId](#getfilebyfileid)
-   [updateFile](#updatefile)
-   [deleteFile](#deletefile)
-   [deleteFiles](#deletefiles)
-   [createFolder](#createfolder)
-   [updateFolder](#updatefolder)
-   [deleteFolder](#deletefolder)
-   [getModules](#getmodules)
-   [getModule](#getmodule)

## Methods with example and description

### fileUpload

**Summary**: Upload File

```javascript
// Promise
const fs = require("fs");
const promise = assets.fileUpload({
    file: fs.createReadStream("your-file-path"),
    path: "path/to/containing/folder",
    name: "filename",
    access: "public-read",
    tags: ["tag1", "tag2"],
    metadata: {},
    overwrite: false,
    filenameOverride: true,
});

// Async/Await
const fs = require("fs");
const data = await assets.fileUpload({
    file: fs.createReadStream("your-file-path"),
    path: "path/to/containing/folder",
    name: "filename",
    access: "public-read",
    tags: ["tag1", "tag2"],
    metadata: {},
    overwrite: false,
    filenameOverride: true,
});
```

| Argument         | Type                      | Required | Description                                                                                                                                                                                                                      |
| ---------------- | ------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| file             | file                      | yes      | Asset file                                                                                                                                                                                                                       |
| path             | string                    | no       | Path where you want to store the asset. Path of containing folder                                                                                                                                                                |
| name             | string                    | no       | Name of the asset, if not provided name of the file will be used. Note - The provided name will be slugified to make it URL safe                                                                                                 |
| access           | [AccessEnum](#accessenum) | no       | Access level of asset, can be either `public-read` or `private`                                                                                                                                                                  |
| tags             | [string]                  | no       | Asset tags                                                                                                                                                                                                                       |
| metadata         | string                    | no       | Asset related metadata                                                                                                                                                                                                           |
| overwrite        | boolean                   | no       | Overwrite flag. If set to `true` will overwrite any file that exists with same path, name and type. Defaults to `false`.                                                                                                         |
| filenameOverride | boolean                   | no       | If set to `true` will add unique characters to name if asset with given name already exists. If overwrite flag is set to `true`, preference will be given to overwrite flag. If both are set to `false` an error will be raised. |

Upload File to Pixelbin

_Returned Response:_

[UploadResponse](#uploadresponse)

Success

<details>
<summary><i>&nbsp; Example:</i></summary>

```json
{
    "_id": "dummy-uuid",
    "name": "asset",
    "path": "dir",
    "fileId": "dir/asset",
    "format": "jpeg",
    "size": 1000,
    "access": "private",
    "isActive": true,
    "tags": ["tag1", "tag2"],
    "metadata": {
        "key": "value"
    },
    "url": "https://domain.com/filename.jpeg"
}
```

</details>

---

### urlUpload

**Summary**: Upload Asset with url

```javascript
// Promise

const promise = assets.urlUpload({
    url: "www.dummy.com/image.png",
    path: "path/to/containing/folder",
    name: "filename",
    access: "public-read",
    tags: ["tag1", "tag2"],
    metadata: {},
    overwrite: false,
    filenameOverride: true,
});

// Async/Await

const data = await assets.urlUpload({
    url: "www.dummy.com/image.png",
    path: "path/to/containing/folder",
    name: "filename",
    access: "public-read",
    tags: ["tag1", "tag2"],
    metadata: {},
    overwrite: false,
    filenameOverride: true,
});
```

| Argument         | Type                      | Required | Description                                                                                                                                                                                                                      |
| ---------------- | ------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| url              | string                    | yes      | Asset URL                                                                                                                                                                                                                        |
| path             | string                    | no       | Path where you want to store the asset. Path of containing folder.                                                                                                                                                               |
| name             | string                    | no       | Name of the asset, if not provided name of the file will be used. Note - The provided name will be slugified to make it URL safe                                                                                                 |
| access           | [AccessEnum](#accessenum) | no       | Access level of asset, can be either `public-read` or `private`                                                                                                                                                                  |
| tags             | [string]                  | no       | Asset tags                                                                                                                                                                                                                       |
| metadata         | string                    | no       | Asset related metadata                                                                                                                                                                                                           |
| overwrite        | boolean                   | no       | Overwrite flag. If set to `true` will overwrite any file that exists with same path, name and type. Defaults to `false`.                                                                                                         |
| filenameOverride | boolean                   | no       | If set to `true` will add unique characters to name if asset with given name already exists. If overwrite flag is set to `true`, preference will be given to overwrite flag. If both are set to `false` an error will be raised. |

Upload Asset with url

_Returned Response:_

[UploadResponse](#uploadresponse)

Success

<details>
<summary><i>&nbsp; Example:</i></summary>

```json
{
    "_id": "dummy-uuid",
    "name": "asset",
    "path": "dir",
    "fileId": "dir/asset",
    "format": "jpeg",
    "size": 1000,
    "access": "private",
    "isActive": true,
    "tags": ["tag1", "tag2"],
    "metadata": {
        "key": "value"
    },
    "url": "https://domain.com/filename.jpeg"
}
```

</details>

---

### createSignedUrl

**Summary**: S3 Signed URL upload

```javascript
// Promise

const promise = assets.createSignedUrl({
    name: "filename",
    path: "path/to/containing/folder",
    format: "jpeg",
    access: "public-read",
    tags: ["tag1", "tag2"],
    metadata: {},
    overwrite: false,
    filenameOverride: true,
});

// Async/Await

const data = await assets.createSignedUrl({
    name: "filename",
    path: "path/to/containing/folder",
    format: "jpeg",
    access: "public-read",
    tags: ["tag1", "tag2"],
    metadata: {},
    overwrite: false,
    filenameOverride: true,
});
```

| Argument         | Type                      | Required | Description                                                                                                                                                                                                                      |
| ---------------- | ------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| name             | string                    | no       | name of the file                                                                                                                                                                                                                 |
| path             | string                    | no       | Path of containing folder.                                                                                                                                                                                                       |
| format           | string                    | no       | Format of the file                                                                                                                                                                                                               |
| access           | [AccessEnum](#accessenum) | no       | Access level of asset, can be either `public-read` or `private`                                                                                                                                                                  |
| tags             | [string]                  | no       | Tags associated with the file.                                                                                                                                                                                                   |
| metadata         | string                    | no       | Metadata associated with the file.                                                                                                                                                                                               |
| overwrite        | boolean                   | no       | Overwrite flag. If set to `true` will overwrite any file that exists with same path, name and type. Defaults to `false`.                                                                                                         |
| filenameOverride | boolean                   | no       | If set to `true` will add unique characters to name if asset with given name already exists. If overwrite flag is set to `true`, preference will be given to overwrite flag. If both are set to `false` an error will be raised. |

For the given asset details, a S3 signed URL will be generated,
which can be then used to upload your asset.

_Returned Response:_

[SignedUploadResponse](#signeduploadresponse)

Success

<details>
<summary><i>&nbsp; Example:</i></summary>

```json
{
    "s3PresignedUrl": {
        "url": "https://domain.com/xyz",
        "fields": {
            "field1": "value",
            "field2": "value"
        }
    }
}
```

</details>

---

### listFiles

**Summary**: List and search files and folders.

```javascript
// Promise

const promise = assets.listFiles({
    name: "cat",
    path: "cat-photos",
    format: "jpeg",
    tags: ["cats", "animals"],
    onlyFiles: "false",
    onlyFolders: "false",
    pageNo: "1",
    pageSize: "10",
    sort: "name",
});

// Async/Await

const data = await assets.listFiles({
    name: "cat",
    path: "cat-photos",
    format: "jpeg",
    tags: ["cats", "animals"],
    onlyFiles: "false",
    onlyFolders: "false",
    pageNo: "1",
    pageSize: "10",
    sort: "name",
});
```

| Argument    | Type     | Required | Description                                                                  |
| ----------- | -------- | -------- | ---------------------------------------------------------------------------- |
| name        | string   | no       | Find items with matching name                                                |
| path        | string   | no       | Find items with matching path                                                |
| format      | string   | no       | Find items with matching format                                              |
| tags        | [string] | no       | Find items containing these tags                                             |
| onlyFiles   | boolean  | no       | If true will fetch only files                                                |
| onlyFolders | boolean  | no       | If true will fetch only folders                                              |
| pageNo      | number   | no       | Page No.                                                                     |
| pageSize    | number   | no       | Page Size                                                                    |
| sort        | string   | no       | Key to sort results by. A "-" suffix will sort results in descending orders. |

List all files and folders in root folder. Search for files if name is provided. If path is provided, search in the specified path.

_Returned Response:_

[ListFilesResponse](#listfilesresponse)

Success

<details>
<summary><i>&nbsp; Example:</i></summary>

```json
{
    "items": [
        {
            "_id": "dummy-uuid",
            "name": "dir",
            "type": "folder"
        },
        {
            "_id": "dummy-uuid",
            "name": "asset2",
            "type": "file",
            "path": "dir",
            "fileId": "dir/asset2",
            "format": "jpeg",
            "size": 1000,
            "access": "private"
        },
        {
            "_id": "dummy-uuid",
            "name": "asset1",
            "type": "file",
            "path": "dir",
            "fileId": "dir/asset1",
            "format": "jpeg",
            "size": 1000,
            "access": "private"
        }
    ],
    "page": {
        "type": "number",
        "size": 4,
        "current": 1,
        "hasNext": false
    }
}
```

</details>

---

### listFilesPaginator

**Summary**: Paginator for listFiles

Paginator exposes `hasNext` and `next` methods to paginate through pages.

```javascript
const paginator = assets.listFilesPaginator({
    name: "cat",
    path: "cat-photos",
    format: "jpeg",
    tags: ["cats", "animals"],
    onlyFiles: "false",
    onlyFolders: "false",
    pageSize: "10",
    sort: "name",
});
while (paginator.hasNext()) {
    const { items, page } = await paginator.next();
    console.log(page.current); // 1
    console.log(page.hasNext); // false
    console.log(page.size); // 3
    console.log(items.length); // 3
}
```

| Argument    | Type     | Required | Description                                                                  |
| ----------- | -------- | -------- | ---------------------------------------------------------------------------- |
| name        | string   | no       | Find items with matching name                                                |
| path        | string   | no       | Find items with matching path                                                |
| format      | string   | no       | Find items with matching format                                              |
| tags        | [string] | no       | Find items containing these tags                                             |
| onlyFiles   | boolean  | no       | If true will fetch only files                                                |
| onlyFolders | boolean  | no       | If true will fetch only folders                                              |
| pageSize    | number   | no       | Page Size                                                                    |
| sort        | string   | no       | Key to sort results by. A "-" suffix will sort results in descending orders. |

List all files and folders in root folder. Search for files if name is provided. If path is provided, search in the specified path.

_Returned Response:_

[ListFilesResponse](#listfilesresponse)

Success

<details>
<summary><i>&nbsp; Example:</i></summary>

```json
{
    "items": [
        {
            "_id": "dummy-uuid",
            "name": "dir",
            "type": "folder"
        },
        {
            "_id": "dummy-uuid",
            "name": "asset2",
            "type": "file",
            "path": "dir",
            "fileId": "dir/asset2",
            "format": "jpeg",
            "size": 1000,
            "access": "private"
        },
        {
            "_id": "dummy-uuid",
            "name": "asset1",
            "type": "file",
            "path": "dir",
            "fileId": "dir/asset1",
            "format": "jpeg",
            "size": 1000,
            "access": "private"
        }
    ],
    "page": {
        "type": "number",
        "size": 4,
        "current": 1,
        "hasNext": false
    }
}
```

</details>

### getFileById

**Summary**: Get file details with \_id

```javascript
// Promise

const promise = assets.getFileById({
    _id: "c9138153-94ea-4dbe-bea9-65d43dba85ae",
});

// Async/Await

const data = await assets.getFileById({
    _id: "c9138153-94ea-4dbe-bea9-65d43dba85ae",
});
```

| Argument | Type   | Required | Description  |
| -------- | ------ | -------- | ------------ |
| \_id     | string | yes      | \_id of File |

_Returned Response:_

[FilesResponse](#filesresponse)

Success

<details>
<summary><i>&nbsp; Example:</i></summary>

```json
{
    "_id": "dummy-uuid",
    "name": "asset",
    "path": "dir",
    "fileId": "dir/asset",
    "format": "jpeg",
    "size": 1000,
    "access": "private",
    "isActive": true,
    "tags": ["tag1", "tag2"],
    "metadata": {
        "key": "value"
    },
    "url": "https://domain.com/filename.jpeg"
}
```

</details>

---

### getFileByFileId

**Summary**: Get file details with fileId

```javascript
// Promise

const promise = assets.getFileByFileId({
    fileId: "path/to/file/name",
});

// Async/Await

const data = await assets.getFileByFileId({
    fileId: "path/to/file/name",
});
```

| Argument | Type   | Required | Description                              |
| -------- | ------ | -------- | ---------------------------------------- |
| fileId   | string | yes      | Combination of `path` and `name` of file |

_Returned Response:_

[FilesResponse](#filesresponse)

Success

<details>
<summary><i>&nbsp; Example:</i></summary>

```json
{
    "_id": "dummy-uuid",
    "name": "asset",
    "path": "dir",
    "fileId": "dir/asset",
    "format": "jpeg",
    "size": 1000,
    "access": "private",
    "isActive": true,
    "tags": ["tag1", "tag2"],
    "metadata": {
        "key": "value"
    },
    "url": "https://domain.com/filename.jpeg"
}
```

</details>

---

### updateFile

**Summary**: Update file details

```javascript
// Promise

const promise = assets.updateFile({
    fileId: "path/to/file/name",
    name: "asset",
    path: "dir",
    access: "private",
    isActive: false,
    tags: ["tag1", "tag2"],
    metadata: { key: "value" },
});

// Async/Await

const data = await assets.updateFile({
    fileId: "path/to/file/name",
    name: "asset",
    path: "dir",
    access: "private",
    isActive: false,
    tags: ["tag1", "tag2"],
    metadata: { key: "value" },
});
```

| Argument | Type     | Required | Description                                                     |
| -------- | -------- | -------- | --------------------------------------------------------------- |
| fileId   | string   | yes      | Combination of `path` and `name`                                |
| name     | string   | no       | Name of the file                                                |
| path     | string   | no       | path of containing folder.                                      |
| access   | string   | no       | Access level of asset, can be either `public-read` or `private` |
| isActive | boolean  | no       | Whether the file is active                                      |
| tags     | [string] | no       | Tags associated with the file                                   |
| metadata | string   | no       | Metadata associated with the file                               |

_Returned Response:_

[FilesResponse](#filesresponse)

Success

<details>
<summary><i>&nbsp; Example:</i></summary>

```json
{
    "_id": "dummy-uuid",
    "name": "asset",
    "path": "dir",
    "fileId": "dir/asset",
    "format": "jpeg",
    "size": 1000,
    "access": "private",
    "isActive": true,
    "tags": ["tag1", "tag2"],
    "metadata": {
        "key": "value"
    },
    "url": "https://domain.com/filename.jpeg"
}
```

</details>

---

### deleteFile

**Summary**: Delete file

```javascript
// Promise

const promise = assets.deleteFile({
    fileId: "path/to/file/name",
});

// Async/Await

const data = await assets.deleteFile({
    fileId: "path/to/file/name",
});
```

| Argument | Type   | Required | Description                      |
| -------- | ------ | -------- | -------------------------------- |
| fileId   | string | yes      | Combination of `path` and `name` |

_Returned Response:_

[FilesResponse](#filesresponse)

Success

<details>
<summary><i>&nbsp; Example:</i></summary>

```json
{
    "_id": "dummy-uuid",
    "name": "asset",
    "path": "dir",
    "fileId": "dir/asset",
    "format": "jpeg",
    "size": 1000,
    "access": "private",
    "isActive": true,
    "tags": ["tag1", "tag2"],
    "metadata": {
        "key": "value"
    },
    "url": "https://domain.com/filename.jpeg"
}
```

</details>

---

### deleteFiles

**Summary**: Delete multiple files

```javascript
// Promise

const promise = assets.deleteFiles({
    ids: ["_id_1", "_id_2", "_id_3"],
});

// Async/Await

const data = await assets.deleteFiles({
    ids: ["_id_1", "_id_2", "_id_3"],
});
```

| Argument | Type     | Required | Description                   |
| -------- | -------- | -------- | ----------------------------- |
| ids      | [string] | yes      | Array of file \_ids to delete |

_Returned Response:_

[FilesResponse](#filesresponse)

Success

<details>
<summary><i>&nbsp; Example:</i></summary>

```json
{
    "_id": "dummy-uuid",
    "name": "asset",
    "path": "dir",
    "fileId": "dir/asset",
    "format": "jpeg",
    "size": 1000,
    "access": "private",
    "isActive": true,
    "tags": ["tag1", "tag2"],
    "metadata": {
        "key": "value"
    },
    "url": "https://domain.com/filename.jpeg"
}
```

</details>

---

### createFolder

**Summary**: Create folder

```javascript
// Promise

const promise = assets.createFolder({
    name: "subDir",
    path: "dir",
});

// Async/Await

const data = await assets.createFolder({
    name: "subDir",
    path: "dir",
});
```

| Argument | Type   | Required | Description                |
| -------- | ------ | -------- | -------------------------- |
| name     | string | yes      | Name of the folder         |
| path     | string | no       | path of containing folder. |

Create a new folder at the specified path. Also creates the ancestors if they do not exist.

_Returned Response:_

[[FoldersResponse]](#[foldersresponse])

Success - List of all created folders

<details>
<summary><i>&nbsp; Example:</i></summary>

```json
[
    {
        "_id": "dummy-uuid",
        "name": "subDir",
        "path": "dir",
        "isActive": true
    },
    {
        "_id": "dummy-uuid-2",
        "name": "subDir",
        "path": "dir",
        "isActive": true
    }
]
```

</details>

---

### updateFolder

**Summary**: Update folder details

```javascript
// Promise

const promise = assets.updateFolder({
    folderId: "path/to/folder/name",
    isActive: false,
});

// Async/Await

const data = await assets.updateFolder({
    folderId: "path/to/folder/name",
    isActive: false,
});
```

| Argument | Type    | Required | Description                      |
| -------- | ------- | -------- | -------------------------------- |
| folderId | string  | yes      | combination of `path` and `name` |
| isActive | boolean | no       | whether the folder is active     |

Update folder details. Eg: Soft delete it
by making `isActive` as `false`.
We currently do not support updating folder name or path.

_Returned Response:_

[FoldersResponse](#foldersresponse)

Success

<details>
<summary><i>&nbsp; Example:</i></summary>

```json
{
    "_id": "dummy-uuid",
    "name": "subDir",
    "path": "dir",
    "isActive": true
}
```

</details>

---

### deleteFolder

**Summary**: Delete folder

```javascript
// Promise

const promise = assets.deleteFolder({
    _id: "c9138153-94ea-4dbe-bea9-65d43dba85ae",
});

// Async/Await

const data = await assets.deleteFolder({
    _id: "c9138153-94ea-4dbe-bea9-65d43dba85ae",
});
```

| Argument | Type   | Required | Description                  |
| -------- | ------ | -------- | ---------------------------- |
| \_id     | string | yes      | \_id of folder to be deleted |

Delete folder and all its children permanently.

_Returned Response:_

[[FoldersResponse]](#[foldersresponse])

Success

<details>
<summary><i>&nbsp; Example:</i></summary>

```json
[
    {
        "_id": "dummy-uuid",
        "name": "subDir",
        "path": "dir",
        "isActive": true
    },
    {
        "_id": "dummy-uuid-2",
        "name": "subDir",
        "path": "dir",
        "isActive": true
    }
]
```

</details>

---

### getModules

**Summary**: Get all transformation modules

```javascript
// Promise

const promise = assets.getModules();

// Async/Await

const data = await assets.getModules();
```

Get all transformation modules.

_Returned Response:_

[TransformationModulesResponse](#transformationmodulesresponse)

Success

<details>
<summary><i>&nbsp; Example:</i></summary>

```json
{
    "delimiters": {
        "operationSeparator": "~",
        "parameterSeparator": ":"
    },
    "plugins": {
        "erase": {
            "identifier": "erase",
            "name": "EraseBG",
            "description": "EraseBG Background Removal Module",
            "credentials": {
                "required": false
            },
            "operations": [
                {
                    "params": {
                        "name": "Industry Type",
                        "type": "enum",
                        "enum": ["general", "ecommerce"],
                        "default": "general",
                        "identifier": "i",
                        "title": "Industry type"
                    },
                    "displayName": "Remove background of an image",
                    "method": "bg",
                    "description": "Remove the background of any image"
                }
            ],
            "enabled": true
        }
    },
    "presets": [
        {
            "_id": "dummy-id",
            "createdAt": "2022-02-14T10:06:17.803Z",
            "updatedAt": "2022-02-14T10:06:17.803Z",
            "isActive": true,
            "orgId": "265",
            "presetName": "compressor",
            "transformation": "t.compress(q:95)",
            "archived": false
        }
    ]
}
```

</details>

---

### getModule

**Summary**: Get Transformation Module by module identifier

```javascript
// Promise

const promise = assets.getModule({
    identifier: "t",
});

// Async/Await

const data = await assets.getModule({
    identifier: "t",
});
```

| Argument   | Type   | Required | Description                         |
| ---------- | ------ | -------- | ----------------------------------- |
| identifier | string | yes      | identifier of Transformation Module |

Get Transformation Module by module identifier

_Returned Response:_

[TransformationModuleResponse](#transformationmoduleresponse)

Success

<details>
<summary><i>&nbsp; Example:</i></summary>

```json
{
    "identifier": "erase",
    "name": "EraseBG",
    "description": "EraseBG Background Removal Module",
    "credentials": {
        "required": false
    },
    "operations": [
        {
            "params": {
                "name": "Industry Type",
                "type": "enum",
                "enum": ["general", "ecommerce"],
                "default": "general",
                "identifier": "i",
                "title": "Industry type"
            },
            "displayName": "Remove background of an image",
            "method": "bg",
            "description": "Remove the background of any image"
        }
    ],
    "enabled": true
}
```

</details>

---

### Schemas

#### folderItem

| Properties | Type   | Nullable | Description                          |
| ---------- | ------ | -------- | ------------------------------------ |
| \_id       | string | yes      | Id of the folder item                |
| name       | string | yes      | Name of the folder item              |
| path       | string | yes      | Path of containing folder            |
| type       | string | yes      | Type of the item. `file` or `folder` |

---

#### exploreItem

| Properties | Type   | Nullable | Description                                                     |
| ---------- | ------ | -------- | --------------------------------------------------------------- |
| \_id       | string | yes      | id of the exploreItem                                           |
| name       | string | yes      | name of the item                                                |
| type       | string | yes      | Type of item whether `file` or `folder`                         |
| path       | string | yes      | Path of containing folder                                       |
| fileId     | string | no       | Combination of `path` and `name` of file                        |
| format     | string | no       | Format of the file                                              |
| size       | number | no       | Size of the file in bytes                                       |
| access     | string | no       | Access level of asset, can be either `public-read` or `private` |

---

#### page

| Properties | Type    | Nullable | Description                   |
| ---------- | ------- | -------- | ----------------------------- |
| type       | string  | yes      | Type of page                  |
| size       | number  | yes      | Number of items on the page   |
| current    | number  | yes      | Current page number.          |
| hasNext    | boolean | yes      | Whether the next page exists. |
| itemTotal  | number  | yes      | Total number of items.        |

---

#### exploreResponse

| Properties | Type                          | Nullable | Description                  |
| ---------- | ----------------------------- | -------- | ---------------------------- |
| items      | [[exploreItem](#exploreitem)] | yes      | exploreItems in current page |
| page       | [page](#page)                 | yes      | page details                 |

---

#### ListFilesResponse

| Properties | Type                          | Nullable | Description                  |
| ---------- | ----------------------------- | -------- | ---------------------------- |
| items      | [[exploreItem](#exploreitem)] | yes      | exploreItems in current page |
| page       | [page](#page)                 | yes      | page details                 |

---

#### exploreFolderResponse

| Properties | Type                          | Nullable | Description                  |
| ---------- | ----------------------------- | -------- | ---------------------------- |
| folder     | [folderItem](#folderitem)     | yes      | requested folder item        |
| items      | [[exploreItem](#exploreitem)] | yes      | exploreItems in current page |
| page       | [page](#page)                 | yes      | page details                 |

---

#### FileUploadRequest

| Properties       | Type                      | Nullable | Description                                                                                                                                                                                                                      |
| ---------------- | ------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| file             | file                      | yes      | Asset file                                                                                                                                                                                                                       |
| path             | string                    | no       | Path where you want to store the asset. Path of containing folder                                                                                                                                                                |
| name             | string                    | no       | Name of the asset, if not provided name of the file will be used. Note - The provided name will be slugified to make it URL safe                                                                                                 |
| access           | [AccessEnum](#accessenum) | no       | Access level of asset, can be either `public-read` or `private`                                                                                                                                                                  |
| tags             | [string]                  | no       | Asset tags                                                                                                                                                                                                                       |
| metadata         | string                    | no       | Asset related metadata                                                                                                                                                                                                           |
| overwrite        | boolean                   | no       | Overwrite flag. If set to `true` will overwrite any file that exists with same path, name and type. Defaults to `false`.                                                                                                         |
| filenameOverride | boolean                   | no       | If set to `true` will add unique characters to name if asset with given name already exists. If overwrite flag is set to `true`, preference will be given to overwrite flag. If both are set to `false` an error will be raised. |

---

#### UrlUploadRequest

| Properties       | Type                      | Nullable | Description                                                                                                                                                                                                                      |
| ---------------- | ------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| url              | string                    | yes      | Asset URL                                                                                                                                                                                                                        |
| path             | string                    | no       | Path where you want to store the asset. Path of containing folder.                                                                                                                                                               |
| name             | string                    | no       | Name of the asset, if not provided name of the file will be used. Note - The provided name will be slugified to make it URL safe                                                                                                 |
| access           | [AccessEnum](#accessenum) | no       | Access level of asset, can be either `public-read` or `private`                                                                                                                                                                  |
| tags             | [string]                  | no       | Asset tags                                                                                                                                                                                                                       |
| metadata         | string                    | no       | Asset related metadata                                                                                                                                                                                                           |
| overwrite        | boolean                   | no       | Overwrite flag. If set to `true` will overwrite any file that exists with same path, name and type. Defaults to `false`.                                                                                                         |
| filenameOverride | boolean                   | no       | If set to `true` will add unique characters to name if asset with given name already exists. If overwrite flag is set to `true`, preference will be given to overwrite flag. If both are set to `false` an error will be raised. |

---

#### UploadResponse

| Properties | Type     | Nullable | Description                                                 |
| ---------- | -------- | -------- | ----------------------------------------------------------- |
| \_id       | string   | yes      | \_id of the item                                            |
| fileId     | string   | yes      | Combination of `path` and `name` of file                    |
| name       | string   | yes      | name of the item                                            |
| path       | string   | yes      | path to the parent folder                                   |
| format     | string   | yes      | format of the file                                          |
| size       | number   | yes      | size of file in bytes                                       |
| access     | string   | yes      | Access level of asset, can be either public-read or private |
| tags       | [string] | no       | tags associated with the item                               |
| metadata   | string   | no       | metadata associated with the item                           |
| url        | string   | no       | url of the item                                             |
| thumbnail  | string   | no       | url of item thumbnail                                       |

---

#### SignedUploadRequest

| Properties       | Type                      | Nullable | Description                                                                                                                                                                                                                      |
| ---------------- | ------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| name             | string                    | no       | name of the file                                                                                                                                                                                                                 |
| path             | string                    | no       | Path of containing folder.                                                                                                                                                                                                       |
| format           | string                    | no       | Format of the file                                                                                                                                                                                                               |
| access           | [AccessEnum](#accessenum) | no       | Access level of asset, can be either `public-read` or `private`                                                                                                                                                                  |
| tags             | [string]                  | no       | Tags associated with the file.                                                                                                                                                                                                   |
| metadata         | string                    | no       | Metadata associated with the file.                                                                                                                                                                                               |
| overwrite        | boolean                   | no       | Overwrite flag. If set to `true` will overwrite any file that exists with same path, name and type. Defaults to `false`.                                                                                                         |
| filenameOverride | boolean                   | no       | If set to `true` will add unique characters to name if asset with given name already exists. If overwrite flag is set to `true`, preference will be given to overwrite flag. If both are set to `false` an error will be raised. |

---

#### SignedUploadResponse

| Properties     | Type                          | Nullable | Description                                  |
| -------------- | ----------------------------- | -------- | -------------------------------------------- |
| s3PresignedUrl | [PresignedUrl](#presignedurl) | yes      | `signedDetails` for upload with frontend sdk |
|  |

---

#### PresignedUrl

| Properties | Type   | Nullable | Description                                 |
| ---------- | ------ | -------- | ------------------------------------------- |
| url        | string | no       | `presigned url` for upload                  |
|  |
| fields     | string | no       | signed fields to be sent along with request |

---

#### FilesResponse

| Properties | Type     | Nullable | Description                                                    |
| ---------- | -------- | -------- | -------------------------------------------------------------- |
| \_id       | string   | yes      | \_id of the file                                               |
| name       | string   | yes      | name of the file                                               |
| path       | string   | yes      | path of containing folder.                                     |
| fileId     | string   | yes      | Combination of `path` and `name` of file                       |
| format     | string   | yes      | format of the file                                             |
| size       | number   | yes      | size of the file in bytes                                      |
| access     | string   | yes      | Access level of file, can be either `public-read` or `private` |
| isActive   | boolean  | yes      | Whether the file is active                                     |
| tags       | [string] | no       | Tags associated with the file                                  |
| metadata   | string   | no       | Metadata associated with the file                              |
| url        | string   | no       | url of the file                                                |
| thumbnail  | string   | no       | url of the thumbnail of the file                               |

---

#### UpdateFileRequest

| Properties | Type     | Nullable | Description                                                     |
| ---------- | -------- | -------- | --------------------------------------------------------------- |
| name       | string   | no       | Name of the file                                                |
| path       | string   | no       | path of containing folder.                                      |
| access     | string   | no       | Access level of asset, can be either `public-read` or `private` |
| isActive   | boolean  | no       | Whether the file is active                                      |
| tags       | [string] | no       | Tags associated with the file                                   |
| metadata   | string   | no       | Metadata associated with the file                               |

---

#### FoldersResponse

| Properties | Type    | Nullable | Description                  |
| ---------- | ------- | -------- | ---------------------------- |
| \_id       | string  | yes      | \_id of the folder           |
| name       | string  | yes      | name of the folder           |
| path       | string  | yes      | path of containing folder.   |
| isActive   | boolean | yes      | whether the folder is active |

---

#### CreateFolderRequest

| Properties | Type   | Nullable | Description                |
| ---------- | ------ | -------- | -------------------------- |
| name       | string | yes      | Name of the folder         |
| path       | string | no       | path of containing folder. |

---

#### UpdateFolderRequest

| Properties | Type    | Nullable | Description                  |
| ---------- | ------- | -------- | ---------------------------- |
| isActive   | boolean | no       | whether the folder is active |

---

#### TransformationModulesResponse

| Properties | Type                                                                    | Nullable | Description                                         |
| ---------- | ----------------------------------------------------------------------- | -------- | --------------------------------------------------- |
| delimiters | [Delimiter](#delimiter)                                                 | no       | Delimiter for parsing plugin schema                 |
| plugins    | [String: [TransformationModuleResponse](#transformationmoduleresponse)] | no       | Transformations currently supported by the pixelbin |
| presets    | [any]                                                                   | no       | List of saved presets                               |

---

#### DeleteMultipleFilesRequest

| Properties | Type     | Nullable | Description                   |
| ---------- | -------- | -------- | ----------------------------- |
| ids        | [string] | yes      | Array of file \_ids to delete |

---

#### Delimiter

| Properties         | Type   | Nullable | Description                                                              |
| ------------------ | ------ | -------- | ------------------------------------------------------------------------ |
| operationSeparator | string | no       | separator to separate operations in the url pattern                      |
| parameterSeparator | string | no       | separator to separate parameters used with operations in the url pattern |

---

#### TransformationModuleResponse

| Properties  | Type    | Nullable | Description                                     |
| ----------- | ------- | -------- | ----------------------------------------------- |
| identifier  | string  | no       | identifier for the plugin type                  |
| name        | string  | no       | name of the plugin                              |
| description | string  | no       | description of the plugin                       |
| credentials | string  | no       | credentials, if any, associated with the plugin |
| operations  | [any]   | no       | supported operations in the plugin              |
| enabled     | boolean | no       | whether the plugin is enabled                   |

---

### Enums

#### [AccessEnum](#AccessEnum)

Type : string

| Name        | Value       | Description                                |
| ----------- | ----------- | ------------------------------------------ |
| public-read | public-read | Object is available for public read access |
| private     | private     | Object is private                          |

---
