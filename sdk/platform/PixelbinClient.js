const FormData = require("form-data");
const { AssetsValidator, OrganizationValidator } = require("./PlatformModels");
const Paginator = require("../common/Paginator");
const PlatformAPIClient = require("./PlatformAPIClient");
const { PDKClientValidationError } = require("../common/PDKError");

class PixelbinClient {
    constructor(config) {
        this.config = config;
        this.assets = new Assets(config);
        this.organization = new Organization(config);
    }
}

/**
        @typedef folderItem
        
        
        @property { string } _id
        
        @property { string } name
        
        @property { string } path
        
        @property { string } type
        
         
    */

/**
        @typedef exploreItem
        
        
        @property { string } _id
        
        @property { string } name
        
        @property { string } type
        
        @property { string } path
        
        @property { string } [fileId]
        
        @property { string } [format]
        
        @property { number } [size]
        
        @property { string } [access]
        
         
    */

/**
        @typedef page
        
        
        @property { string } type
        
        @property { number } size
        
        @property { number } current
        
        @property { boolean } hasNext
        
        @property { number } itemTotal
        
         
    */

/**
        @typedef exploreResponse
        
        
        @property { Array<exploreItem> } items
        
        @property { page } page
        
         
    */

/**
        @typedef ListFilesResponse
        
        
        @property { Array<exploreItem> } items
        
        @property { page } page
        
         
    */

/**
        @typedef exploreFolderResponse
        
        
        @property { folderItem } folder
        
        @property { Array<exploreItem> } items
        
        @property { page } page
        
         
    */

/**
        @typedef FileUploadRequest
        
        
        @property {  } file
        
        @property { string } [path]
        
        @property { string } [name]
        
        @property { AccessEnum } [access]
        
        @property { Array<string> } [tags]
        
        @property { Object } [metadata]
        
        @property { boolean } [overwrite]
        
        @property { boolean } [filenameOverride]
        
         
    */

/**
        @typedef UrlUploadRequest
        
        
        @property { string } url
        
        @property { string } [path]
        
        @property { string } [name]
        
        @property { AccessEnum } [access]
        
        @property { Array<string> } [tags]
        
        @property { Object } [metadata]
        
        @property { boolean } [overwrite]
        
        @property { boolean } [filenameOverride]
        
         
    */

/**
        @typedef UploadResponse
        
        
        @property { string } _id
        
        @property { string } fileId
        
        @property { string } name
        
        @property { string } path
        
        @property { string } format
        
        @property { number } size
        
        @property { string } access
        
        @property { Array<string> } [tags]
        
        @property { Object } [metadata]
        
        @property { string } [url]
        
        @property { string } [thumbnail]
        
         
    */

/**
        @typedef SignedUploadRequest
        
        
        @property { string } [name]
        
        @property { string } [path]
        
        @property { string } [format]
        
        @property { AccessEnum } [access]
        
        @property { Array<string> } [tags]
        
        @property { Object } [metadata]
        
        @property { boolean } [overwrite]
        
        @property { boolean } [filenameOverride]
        
         
    */

/**
        @typedef SignedUploadResponse
        
        
        @property { PresignedUrl } s3PresignedUrl
        
         
    */

/**
        @typedef PresignedUrl
        
        
        @property { string } [url]
        
        @property { Object } [fields]
        
         
    */

/**
        @typedef FilesResponse
        
        
        @property { string } _id
        
        @property { string } name
        
        @property { string } path
        
        @property { string } fileId
        
        @property { string } format
        
        @property { number } size
        
        @property { string } access
        
        @property { boolean } isActive
        
        @property { Array<string> } [tags]
        
        @property { Object } [metadata]
        
        @property { string } [url]
        
        @property { string } [thumbnail]
        
         
    */

/**
        @typedef UpdateFileRequest
        
        
        @property { string } [name]
        
        @property { string } [path]
        
        @property { string } [access]
        
        @property { boolean } [isActive]
        
        @property { Array<string> } [tags]
        
        @property { Object } [metadata]
        
         
    */

/**
        @typedef FoldersResponse
        
        
        @property { string } _id
        
        @property { string } name
        
        @property { string } path
        
        @property { boolean } isActive
        
         
    */

/**
        @typedef CreateFolderRequest
        
        
        @property { string } name
        
        @property { string } [path]
        
         
    */

/**
        @typedef UpdateFolderRequest
        
        
        @property { boolean } [isActive]
        
         
    */

/**
        @typedef TransformationModulesResponse
        
        
        @property { Delimiter } [delimiters]
        
        @property { Object } [plugins]
        
        @property { Array<any> } [presets]
        
         
    */

/**
        @typedef DeleteMultipleFilesRequest
        
        
        @property { Array<string> } ids
        
         
    */

/**
        @typedef Delimiter
        
        
        @property { string } [operationSeparator]
        
        @property { string } [parameterSeparator]
        
         
    */

/**
        @typedef TransformationModuleResponse
        
        
        @property { string } [identifier]
        
        @property { string } [name]
        
        @property { string } [description]
        
        @property { Object } [credentials]
        
        @property { Array<any> } [operations]
        
        @property { boolean } [enabled]
        
         
    */

/**
        @typedef OrganizationDetailSchema
        
        
        @property { number } [_id]
        
        @property { string } [name]
        
        @property { string } [cloudName]
        
        @property { string } [ownerId]
        
        @property { boolean } [active]
        
        @property { string } [createdAt]
        
        @property { string } [updatedAt]
        
         
    */

/**
        @typedef AppSchema
        
        
        @property { number } [_id]
        
        @property { number } [orgId]
        
        @property { string } [name]
        
        @property { string } [token]
        
        @property { Array<string> } [permissions]
        
        @property { boolean } [active]
        
        @property { string } [createdAt]
        
        @property { string } [updatedAt]
        
         
    */

/**
        @typedef AppDetailsByToken
        
        
        @property { AppSchema } [app]
        
        @property { OrganizationDetailSchema } [org]
        
         
    */

/**
        @typedef ErrorSchema
        
        
        @property { string } [message]
        
         
    */

class Assets {
    constructor(config) {
        this.config = config;
    }

    /**
    *
    * @summary: Upload File
    * @description: Upload File to Pixelbin
    * @param {Object} arg - arg object.    
    * @param {file} arg.file Asset file
    * @param {string} arg.path Path where you want to store the asset. Path of containing folder
    * @param {string} arg.name Name of the asset, if not provided name of the file will be used. Note - The provided name will be slugified to make it URL safe
    * @param {AccessEnum} arg.access Access level of asset, can be either `public-read` or `private`
    * @param {[string]} arg.tags Asset tags
    * @param {object} arg.metadata Asset related metadata
    * @param {boolean} arg.overwrite Overwrite flag. If set to `true` will overwrite any file that exists with same path, name and type. Defaults to `false`.
    * @param {boolean} arg.filenameOverride If set to `true` will add unique characters to name if asset with given name already exists. If overwrite flag is set to `true`, preference will be given to overwrite flag. If both are set to `false` an error will be raised.
    
    **/
    fileUpload({ file, path, name, access, tags, metadata, overwrite, filenameOverride } = {}) {
        const { error } = AssetsValidator.fileUpload().validate(
            {
                body: { file, path, name, access, tags, metadata, overwrite, filenameOverride },
            },
            { abortEarly: false },
        );
        if (error) {
            return Promise.reject(new PDKClientValidationError(error));
        }

        const query_params = {};

        let body;

        body = new FormData();

        if (file) body.append("file", file);
        if (path) body.append("path", path);
        if (name) body.append("name", name);
        if (access) body.append("access", access);
        if (tags) body.append("tags", tags);
        if (metadata) body.append("metadata", metadata);
        if (overwrite) body.append("overwrite", overwrite);
        if (filenameOverride) body.append("filenameOverride", filenameOverride);

        return PlatformAPIClient.execute(
            this.config,
            "post",
            `/service/platform/assets/v1.0/upload/direct`,
            query_params,
            body,
            "multipart/form-data",
        );
    }

    /**
    *
    * @summary: Upload Asset with url
    * @description: Upload Asset with url
    * @param {Object} arg - arg object.     
    * @param {string} arg.url Asset URL
    * @param {string} arg.path Path where you want to store the asset. Path of containing folder.
    * @param {string} arg.name Name of the asset, if not provided name of the file will be used. Note - The provided name will be slugified to make it URL safe
    * @param {AccessEnum} arg.access Access level of asset, can be either `public-read` or `private`
    * @param {[string]} arg.tags Asset tags
    * @param {object} arg.metadata Asset related metadata
    * @param {boolean} arg.overwrite Overwrite flag. If set to `true` will overwrite any file that exists with same path, name and type. Defaults to `false`.
    * @param {boolean} arg.filenameOverride If set to `true` will add unique characters to name if asset with given name already exists. If overwrite flag is set to `true`, preference will be given to overwrite flag. If both are set to `false` an error will be raised.
    
    **/
    urlUpload({ url, path, name, access, tags, metadata, overwrite, filenameOverride } = {}) {
        const { error } = AssetsValidator.urlUpload().validate(
            {
                body: { url, path, name, access, tags, metadata, overwrite, filenameOverride },
            },
            { abortEarly: false },
        );
        if (error) {
            return Promise.reject(new PDKClientValidationError(error));
        }

        const query_params = {};

        let body;

        body = {
            url,
            path,
            name,
            access,
            tags,
            metadata,
            overwrite,
            filenameOverride,
        };

        return PlatformAPIClient.execute(
            this.config,
            "post",
            `/service/platform/assets/v1.0/upload/url`,
            query_params,
            body,
            "application/json",
        );
    }

    /**
    *
    * @summary: S3 Signed URL upload
    * @description: For the given asset details, a S3 signed URL will be generated,
which can be then used to upload your asset.

    * @param {Object} arg - arg object.     
    * @param {string} arg.name name of the file
    * @param {string} arg.path Path of containing folder.
    * @param {string} arg.format Format of the file
    * @param {AccessEnum} arg.access Access level of asset, can be either `public-read` or `private`
    * @param {[string]} arg.tags Tags associated with the file.
    * @param {object} arg.metadata Metadata associated with the file.
    * @param {boolean} arg.overwrite Overwrite flag. If set to `true` will overwrite any file that exists with same path, name and type. Defaults to `false`.
    * @param {boolean} arg.filenameOverride If set to `true` will add unique characters to name if asset with given name already exists. If overwrite flag is set to `true`, preference will be given to overwrite flag. If both are set to `false` an error will be raised.
    
    **/
    createSignedUrl({
        name,
        path,
        format,
        access,
        tags,
        metadata,
        overwrite,
        filenameOverride,
    } = {}) {
        const { error } = AssetsValidator.createSignedUrl().validate(
            {
                body: { name, path, format, access, tags, metadata, overwrite, filenameOverride },
            },
            { abortEarly: false },
        );
        if (error) {
            return Promise.reject(new PDKClientValidationError(error));
        }

        const query_params = {};

        let body;

        body = {
            name,
            path,
            format,
            access,
            tags,
            metadata,
            overwrite,
            filenameOverride,
        };

        return PlatformAPIClient.execute(
            this.config,
            "post",
            `/service/platform/assets/v1.0/upload/signed-url`,
            query_params,
            body,
            "application/json",
        );
    }

    /**
    *
    * @summary: List and search files and folders.
    * @description: List all files and folders in root folder. Search for files if name is provided. If path is provided, search in the specified path.

    * @param {Object} arg - arg object. 
    * @param {string} [arg.name] - Find items with matching name
    * @param {string} [arg.path] - Find items with matching path
    * @param {string} [arg.format] - Find items with matching format
    * @param {Array<string>} [arg.tags] - Find items containing these tags
    * @param {boolean} [arg.onlyFiles] - If true will fetch only files
    * @param {boolean} [arg.onlyFolders] - If true will fetch only folders
    * @param {number} [arg.pageNo] - Page No.
    * @param {number} [arg.pageSize] - Page Size
    * @param {string} [arg.sort] - Key to sort results by. A "-" suffix will sort results in descending orders.

    
    **/
    listFiles({ name, path, format, tags, onlyFiles, onlyFolders, pageNo, pageSize, sort } = {}) {
        const { error } = AssetsValidator.listFiles().validate(
            {
                name,
                path,
                format,
                tags,
                onlyFiles,
                onlyFolders,
                pageNo,
                pageSize,
                sort,
            },
            { abortEarly: false },
        );
        if (error) {
            return Promise.reject(new PDKClientValidationError(error));
        }

        const query_params = {};
        query_params["name"] = name;
        query_params["path"] = path;
        query_params["format"] = format;
        query_params["tags"] = tags;
        query_params["onlyFiles"] = onlyFiles;
        query_params["onlyFolders"] = onlyFolders;
        query_params["pageNo"] = pageNo;
        query_params["pageSize"] = pageSize;
        query_params["sort"] = sort;

        return PlatformAPIClient.execute(
            this.config,
            "get",
            `/service/platform/assets/v1.0/listFiles`,
            query_params,
            undefined,
        );
    }

    /**
    *
    * @summary: List and search files and folders.
    * @description: List all files and folders in root folder. Search for files if name is provided. If path is provided, search in the specified path.

    * @param {Object} arg - arg object.
    * @param {string} [arg.name] - Find items with matching name
    * @param {string} [arg.path] - Find items with matching path
    * @param {string} [arg.format] - Find items with matching format
    * @param {Array<string>} [arg.tags] - Find items containing these tags
    * @param {boolean} [arg.onlyFiles] - If true will fetch only files
    * @param {boolean} [arg.onlyFolders] - If true will fetch only folders
    * @param {number} [arg.pageSize] - Page Size
    * @param {string} [arg.sort] - Key to sort results by. A "-" suffix will sort results in descending orders.

    
    **/
    listFilesPaginator({ name, path, format, tags, onlyFiles, onlyFolders, pageSize, sort } = {}) {
        const paginator = new Paginator();
        const callback = async () => {
            const pageNo = paginator.pageNo;
            const pageType = "number";
            const data = await this.listFiles({
                name: name,
                path: path,
                format: format,
                tags: tags,
                onlyFiles: onlyFiles,
                onlyFolders: onlyFolders,
                pageNo: pageNo || 1,
                pageSize: pageSize || 25,
                sort: sort,
            });
            paginator.setPaginator({
                hasNext: data.page.hasNext ? true : false,
                pageNo: data.page.current + 1,
            });
            return data;
        };
        paginator.setCallback(callback);
        return paginator;
    }

    /**
    *
    * @summary: Get file details with _id
    * @description: 
    * @param {Object} arg - arg object. 
    * @param {string} arg._id - _id of File
    
    **/
    getFileById({ _id } = {}) {
        const { error } = AssetsValidator.getFileById().validate(
            {
                _id,
            },
            { abortEarly: false },
        );
        if (error) {
            return Promise.reject(new PDKClientValidationError(error));
        }

        const query_params = {};

        return PlatformAPIClient.execute(
            this.config,
            "get",
            `/service/platform/assets/v1.0/files/id/${_id}`,
            query_params,
            undefined,
        );
    }

    /**
    *
    * @summary: Get file details with fileId
    * @description: 
    * @param {Object} arg - arg object. 
    * @param {string} arg.fileId - Combination of `path` and `name` of file
    
    **/
    getFileByFileId({ fileId } = {}) {
        const { error } = AssetsValidator.getFileByFileId().validate(
            {
                fileId,
            },
            { abortEarly: false },
        );
        if (error) {
            return Promise.reject(new PDKClientValidationError(error));
        }

        const query_params = {};

        return PlatformAPIClient.execute(
            this.config,
            "get",
            `/service/platform/assets/v1.0/files/${fileId}`,
            query_params,
            undefined,
        );
    }

    /**
    *
    * @summary: Update file details
    * @description: 
    * @param {Object} arg - arg object.     
    * @param {string} arg.fileId - Combination of `path` and `name`
    * @param {string} arg.name Name of the file
    * @param {string} arg.path path of containing folder.
    * @param {string} arg.access Access level of asset, can be either `public-read` or `private`
    * @param {boolean} arg.isActive Whether the file is active
    * @param {[string]} arg.tags Tags associated with the file
    * @param {object} arg.metadata Metadata associated with the file
    
    **/
    updateFile({ fileId, name, path, access, isActive, tags, metadata } = {}) {
        const { error } = AssetsValidator.updateFile().validate(
            {
                fileId,
                body: { name, path, access, isActive, tags, metadata },
            },
            { abortEarly: false },
        );
        if (error) {
            return Promise.reject(new PDKClientValidationError(error));
        }

        const query_params = {};

        let body;

        body = {
            name,
            path,
            access,
            isActive,
            tags,
            metadata,
        };

        return PlatformAPIClient.execute(
            this.config,
            "patch",
            `/service/platform/assets/v1.0/files/${fileId}`,
            query_params,
            body,
            "application/json",
        );
    }

    /**
    *
    * @summary: Delete file
    * @description: 
    * @param {Object} arg - arg object. 
    * @param {string} arg.fileId - Combination of `path` and `name`
    
    **/
    deleteFile({ fileId } = {}) {
        const { error } = AssetsValidator.deleteFile().validate(
            {
                fileId,
            },
            { abortEarly: false },
        );
        if (error) {
            return Promise.reject(new PDKClientValidationError(error));
        }

        const query_params = {};

        return PlatformAPIClient.execute(
            this.config,
            "delete",
            `/service/platform/assets/v1.0/files/${fileId}`,
            query_params,
            undefined,
        );
    }

    /**
    *
    * @summary: Delete multiple files
    * @description: 
    * @param {Object} arg - arg object.     
    * @param {[string]} arg.ids Array of file _ids to delete
    
    **/
    deleteFiles({ ids } = {}) {
        const { error } = AssetsValidator.deleteFiles().validate(
            {
                body: { ids },
            },
            { abortEarly: false },
        );
        if (error) {
            return Promise.reject(new PDKClientValidationError(error));
        }

        const query_params = {};

        let body;

        body = {
            ids,
        };

        return PlatformAPIClient.execute(
            this.config,
            "post",
            `/service/platform/assets/v1.0/files/delete`,
            query_params,
            body,
            "application/json",
        );
    }

    /**
    *
    * @summary: Create folder
    * @description: Create a new folder at the specified path. Also creates the ancestors if they do not exist.

    * @param {Object} arg - arg object.     
    * @param {string} arg.name Name of the folder
    * @param {string} arg.path path of containing folder.
    
    **/
    createFolder({ name, path } = {}) {
        const { error } = AssetsValidator.createFolder().validate(
            {
                body: { name, path },
            },
            { abortEarly: false },
        );
        if (error) {
            return Promise.reject(new PDKClientValidationError(error));
        }

        const query_params = {};

        let body;

        body = {
            name,
            path,
        };

        return PlatformAPIClient.execute(
            this.config,
            "post",
            `/service/platform/assets/v1.0/folders`,
            query_params,
            body,
            "application/json",
        );
    }

    /**
    *
    * @summary: Update folder details
    * @description: Update folder details. Eg: Soft delete it
by making `isActive` as `false`.
We currently do not support updating folder name or path.

    * @param {Object} arg - arg object.     
    * @param {string} arg.folderId - combination of `path` and `name`
    * @param {boolean} arg.isActive whether the folder is active
    
    **/
    updateFolder({ folderId, isActive } = {}) {
        const { error } = AssetsValidator.updateFolder().validate(
            {
                folderId,
                body: { isActive },
            },
            { abortEarly: false },
        );
        if (error) {
            return Promise.reject(new PDKClientValidationError(error));
        }

        const query_params = {};

        let body;

        body = {
            isActive,
        };

        return PlatformAPIClient.execute(
            this.config,
            "patch",
            `/service/platform/assets/v1.0/folders/${folderId}`,
            query_params,
            body,
            "application/json",
        );
    }

    /**
    *
    * @summary: Delete folder
    * @description: Delete folder and all its children permanently.

    * @param {Object} arg - arg object. 
    * @param {string} arg._id - _id of folder to be deleted
    
    **/
    deleteFolder({ _id } = {}) {
        const { error } = AssetsValidator.deleteFolder().validate(
            {
                _id,
            },
            { abortEarly: false },
        );
        if (error) {
            return Promise.reject(new PDKClientValidationError(error));
        }

        const query_params = {};

        return PlatformAPIClient.execute(
            this.config,
            "delete",
            `/service/platform/assets/v1.0/folders/${_id}`,
            query_params,
            undefined,
        );
    }

    /**
    *
    * @summary: Get all transformation modules
    * @description: Get all transformation modules.

    * @param {Object} arg - arg object. 
    
    **/
    getModules({} = {}) {
        const { error } = AssetsValidator.getModules().validate({}, { abortEarly: false });
        if (error) {
            return Promise.reject(new PDKClientValidationError(error));
        }

        const query_params = {};

        return PlatformAPIClient.execute(
            this.config,
            "get",
            `/service/platform/assets/v1.0/playground/plugins`,
            query_params,
            undefined,
        );
    }

    /**
    *
    * @summary: Get Transformation Module by module identifier
    * @description: Get Transformation Module by module identifier

    * @param {Object} arg - arg object. 
    * @param {string} arg.identifier - identifier of Transformation Module
    
    **/
    getModule({ identifier } = {}) {
        const { error } = AssetsValidator.getModule().validate(
            {
                identifier,
            },
            { abortEarly: false },
        );
        if (error) {
            return Promise.reject(new PDKClientValidationError(error));
        }

        const query_params = {};

        return PlatformAPIClient.execute(
            this.config,
            "get",
            `/service/platform/assets/v1.0/playground/plugins/${identifier}`,
            query_params,
            undefined,
        );
    }
}

class Organization {
    constructor(config) {
        this.config = config;
    }

    /**
    *
    * @summary: Get App Details
    * @description: Get App and org details with the API_TOKEN
    * @param {Object} arg - arg object. 
    * @param {string} arg.token - Pixelbin api token
    
    **/
    getAppByToken({ token } = {}) {
        const { error } = OrganizationValidator.getAppByToken().validate(
            {
                token,
            },
            { abortEarly: false },
        );
        if (error) {
            return Promise.reject(new PDKClientValidationError(error));
        }

        const query_params = {};

        return PlatformAPIClient.execute(
            this.config,
            "get",
            `/service/platform/organization/v1.0/apps/${token}`,
            query_params,
            undefined,
        );
    }
}

module.exports = PixelbinClient;
