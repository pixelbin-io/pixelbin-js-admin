const FormData = require("form-data");
const {
    AssetsValidator,
    OrganizationValidator,
    TransformationValidator,
    BillingValidator,
} = require("./PlatformModels");
const Paginator = require("../common/Paginator");
const PlatformAPIClient = require("./PlatformAPIClient");
const { PDKClientValidationError } = require("../common/PDKError");
const { Uploader } = require("./Uploader");

class PixelbinClient {
    constructor(config) {
        this.config = config;
        this.assets = new Assets(config);
        this.organization = new Organization(config);
        this.transformation = new Transformation(config);
        this.billing = new Billing(config);

        this.uploader = new Uploader(this.assets);
    }
}

/**
        @typedef folderItem
        
        
        @property { string } [_id]
        
        @property { number } [orgId]
        
        @property { string } [name]
        
        @property { string } [path]
        
        @property { string } [type]
        
         
    */

/**
        @typedef exploreItem
        
        
        @property { string } [_id]
        
        @property { number } [orgId]
        
        @property { string } [name]
        
        @property { string } [type]
        
        @property { string } [path]
        
        @property { string } [fileId]
        
        @property { string } [format]
        
        @property { number } [size]
        
        @property { AccessEnum } [access]
        
        @property { string } [s3Bucket]
        
        @property { string } [s3Key]
        
         
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
        
        
        @property { Array<exploreItem> } [items]
        
        @property { page } [page]
        
         
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
        
        @property { AccessEnum } access
        
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
        
        @property { AccessEnum } access
        
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
        
        @property { AccessEnum } [access]
        
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
        @typedef DeleteMultipleFilesRequest
        
        
        @property { Array<string> } ids
        
         
    */

/**
        @typedef Delimiter
        
        
        @property { string } [operationSeparator]
        
        @property { string } [parameterSeparator]
        
         
    */

/**
        @typedef AddCredentialsRequest
        
        
        @property { Object } credentials
        
        @property { string } pluginId
        
         
    */

/**
        @typedef UpdateCredentialsRequest
        
        
        @property { Object } credentials
        
         
    */

/**
        @typedef AddCredentialsResponse
        
        
        @property { Object } [credentials]
        
         
    */

/**
        @typedef GetAncestorsResponse
        
        
        @property { folderItem } [folder]
        
        @property { Array<FoldersResponse> } [ancestors]
        
         
    */

/**
        @typedef AddPresetRequest
        
        
        @property { string } presetName
        
        @property { string } transformation
        
        @property { Object } [params]
        
         
    */

/**
        @typedef AddPresetResponse
        
        
        @property { string } [presetName]
        
        @property { string } [transformation]
        
        @property { Object } [params]
        
        @property { boolean } [archived]
        
        @property { number } [orgId]
        
        @property { boolean } [isActive]
        
        @property { string } [createdAt]
        
        @property { string } [updatedAt]
        
         
    */

/**
        @typedef UpdatePresetRequest
        
        
        @property { boolean } archived
        
         
    */

/**
        @typedef GetPresetsResponse
        
        
        @property { Array<AddPresetResponse> } items
        
        @property { page } page
        
         
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
        @typedef TransformationModulesResponse
        
        
        @property { Delimiter } [delimiters]
        
        @property { Object } [plugins]
        
        @property { Array<any> } [presets]
        
         
    */

/**
        @typedef SignedUploadRequestV2
        
        
        @property { string } [name]
        
        @property { string } [path]
        
        @property { string } [format]
        
        @property { AccessEnum } [access]
        
        @property { Array<string> } [tags]
        
        @property { Object } [metadata]
        
        @property { boolean } [overwrite]
        
        @property { boolean } [filenameOverride]
        
        @property { number } [expiry]
        
         
    */

/**
        @typedef SignedUploadV2Response
        
        
        @property { PresignedUrlV2 } presignedUrl
        
         
    */

/**
        @typedef PresignedUrlV2
        
        
        @property { string } [url]
        
        @property { Object } [fields]
        
         
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
        @typedef AppOrgDetails
        
        
        @property { AppSchema } [app]
        
        @property { OrganizationDetailSchema } [org]
        
         
    */

/**
        @typedef ErrorSchema
        
        
        @property { string } [message]
        
         
    */

/**
        @typedef GetTransformationContextSuccessResponse
        
        
        @property { Object } [context]
        
         
    */

/**
        @typedef NotFoundSchema
        
        
        @property { string } [message]
        
         
    */

/**
        @typedef UsageSchema
        
        
        @property { string } [storage]
        
         
    */

/**
        @typedef ConsumedCreditsSchema
        
        
        @property { number } [used]
        
         
    */

/**
        @typedef TotalUsageSchema
        
        
        @property { number } [credits]
        
        @property { number } [storage]
        
         
    */

/**
        @typedef CompleteUsageSchema
        
        
        @property { ConsumedCreditsSchema } [credits]
        
        @property { TotalUsageSchema } [total]
        
        @property { UsageSchema } [usage]
        
         
    */

/**
        @typedef StorageUsageSchema
        
        
        @property { number } [total]
        
        @property { number } [used]
        
         
    */

/**
        @typedef CreditUsageSchema
        
        
        @property { number } [total]
        
        @property { number } [used]
        
         
    */

/**
        @typedef PixelbinUsageSchema
        
        
        @property { StorageUsageSchema } [storage]
        
        @property { CreditUsageSchema } [credits]
        
         
    */

class Assets {
    constructor(config) {
        this.config = config;
    }

    /**
    *
    * @summary: Add credentials for a transformation module.
    * @description: Add a transformation modules's credentials for an organization.

    * @param {Object} arg - arg object.
    * @param {Object} arg.options - extra options if avaiable     
    * @param {object} arg.credentials Credentials of the plugin
    * @param {string} arg.pluginId Unique identifier for the plugin this credential belongs to
    
    **/
    addCredentials({
        options,

        credentials,
        pluginId,
    } = {}) {
        const { error } = AssetsValidator.addCredentials().validate(
            {
                options,

                body: { credentials, pluginId },
            },
            { abortEarly: false },
        );
        if (error) {
            return Promise.reject(new PDKClientValidationError(error));
        }

        const query_params = {};

        let body;

        body = {
            credentials,
            pluginId,
        };

        return PlatformAPIClient.execute(
            this.config,
            "post",
            `/service/platform/assets/v1.0/credentials`,
            query_params,
            body,
            "application/json",
        );
    }

    /**
    *
    * @summary: Update credentials of a transformation module.
    * @description: Update credentials of a transformation module, for an organization.

    * @param {Object} arg - arg object.
    * @param {Object} arg.options - extra options if avaiable     
    * @param {string} arg.pluginId - ID of the plugin whose credentials are being updated
    * @param {object} arg.credentials Credentials of the plugin
    
    **/
    updateCredentials({ options, pluginId, credentials } = {}) {
        const { error } = AssetsValidator.updateCredentials().validate(
            {
                options,
                pluginId,
                body: { credentials },
            },
            { abortEarly: false },
        );
        if (error) {
            return Promise.reject(new PDKClientValidationError(error));
        }

        const query_params = {};

        let body;

        body = {
            credentials,
        };

        return PlatformAPIClient.execute(
            this.config,
            "patch",
            `/service/platform/assets/v1.0/credentials/${pluginId}`,
            query_params,
            body,
            "application/json",
        );
    }

    /**
    *
    * @summary: Delete credentials of a transformation module.
    * @description: Delete credentials of a transformation module, for an organization.

    * @param {Object} arg - arg object.
    * @param {Object} arg.options - extra options if avaiable 
    * @param {string} arg.pluginId - ID of the plugin whose credentials are being deleted
    
    **/
    deleteCredentials({ options, pluginId } = {}) {
        const { error } = AssetsValidator.deleteCredentials().validate(
            {
                options,
                pluginId,
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
            `/service/platform/assets/v1.0/credentials/${pluginId}`,
            query_params,
            undefined,
        );
    }

    /**
    *
    * @summary: Get file details with _id
    * @description: 
    * @param {Object} arg - arg object.
    * @param {Object} arg.options - extra options if avaiable 
    * @param {string} arg._id - _id of File
    
    **/
    getFileById({ options, _id } = {}) {
        const { error } = AssetsValidator.getFileById().validate(
            {
                options,
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
    * @param {Object} arg.options - extra options if avaiable 
    * @param {string} arg.fileId - Combination of `path` and `name` of file
    
    **/
    getFileByFileId({ options, fileId } = {}) {
        const { error } = AssetsValidator.getFileByFileId().validate(
            {
                options,
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
    * @param {Object} arg.options - extra options if avaiable     
    * @param {string} arg.fileId - Combination of `path` and `name`
    * @param {string} arg.name Name of the file
    * @param {string} arg.path Path of the file
    * @param {AccessEnum} arg.access Access level of asset, can be either `public-read` or `private`
    * @param {boolean} arg.isActive Whether the file is active
    * @param {[string]} arg.tags Tags associated with the file
    * @param {object} arg.metadata Metadata associated with the file
    
    **/
    updateFile({ options, fileId, name, path, access, isActive, tags, metadata } = {}) {
        const { error } = AssetsValidator.updateFile().validate(
            {
                options,
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
    * @param {Object} arg.options - extra options if avaiable 
    * @param {string} arg.fileId - Combination of `path` and `name`
    
    **/
    deleteFile({ options, fileId } = {}) {
        const { error } = AssetsValidator.deleteFile().validate(
            {
                options,
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
    * @param {Object} arg.options - extra options if avaiable     
    * @param {[string]} arg.ids Array of file _ids to delete
    
    **/
    deleteFiles({
        options,

        ids,
    } = {}) {
        const { error } = AssetsValidator.deleteFiles().validate(
            {
                options,

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
    * @param {Object} arg.options - extra options if avaiable     
    * @param {string} arg.name Name of the folder
    * @param {string} arg.path Path of the folder
    
    **/
    createFolder({
        options,

        name,
        path,
    } = {}) {
        const { error } = AssetsValidator.createFolder().validate(
            {
                options,

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
    * @summary: Get folder details
    * @description: Get folder details

    * @param {Object} arg - arg object.
    * @param {Object} arg.options - extra options if avaiable 
    * @param {string} [arg.path] - Folder path
    * @param {string} [arg.name] - Folder name
    
    **/
    getFolderDetails({ options, path, name } = {}) {
        const { error } = AssetsValidator.getFolderDetails().validate(
            {
                options,
                path,
                name,
            },
            { abortEarly: false },
        );
        if (error) {
            return Promise.reject(new PDKClientValidationError(error));
        }

        const query_params = {};
        query_params["path"] = path;
        query_params["name"] = name;

        return PlatformAPIClient.execute(
            this.config,
            "get",
            `/service/platform/assets/v1.0/folders`,
            query_params,
            undefined,
        );
    }

    /**
    *
    * @summary: Update folder details
    * @description: Update folder details. Eg: Soft delete it
by making `isActive` as `false`.
We currently do not support updating folder name or path.

    * @param {Object} arg - arg object.
    * @param {Object} arg.options - extra options if avaiable     
    * @param {string} arg.folderId - combination of `path` and `name`
    * @param {boolean} arg.isActive whether the folder is active
    
    **/
    updateFolder({ options, folderId, isActive } = {}) {
        const { error } = AssetsValidator.updateFolder().validate(
            {
                options,
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
    * @param {Object} arg.options - extra options if avaiable 
    * @param {string} arg._id - _id of folder to be deleted
    
    **/
    deleteFolder({ options, _id } = {}) {
        const { error } = AssetsValidator.deleteFolder().validate(
            {
                options,
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
    * @summary: Get all ancestors of a folder
    * @description: Get all ancestors of a folder, using the folder ID.

    * @param {Object} arg - arg object.
    * @param {Object} arg.options - extra options if avaiable 
    * @param {string} arg._id - _id of the folder
    
    **/
    getFolderAncestors({ options, _id } = {}) {
        const { error } = AssetsValidator.getFolderAncestors().validate(
            {
                options,
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
            `/service/platform/assets/v1.0/folders/${_id}/ancestors`,
            query_params,
            undefined,
        );
    }

    /**
    *
    * @summary: List and search files and folders.
    * @description: List all files and folders in root folder. Search for files if name is provided. If path is provided, search in the specified path.

    * @param {Object} arg - arg object.
    * @param {Object} arg.options - extra options if avaiable 
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
    listFiles({
        options,
        name,
        path,
        format,
        tags,
        onlyFiles,
        onlyFolders,
        pageNo,
        pageSize,
        sort,
    } = {}) {
        const { error } = AssetsValidator.listFiles().validate(
            {
                options,
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
        if (tags && tags instanceof Array && tags.join("")) {
            tags.forEach((param, idx) => {
                query_params[`tags[${idx}]`] = param;
            });
        }
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
    * @summary: Get default asset for playground
    * @description: Get default asset for playground
    * @param {Object} arg - arg object.
    * @param {Object} arg.options - extra options if avaiable 
    
    **/
    getDefaultAssetForPlayground({ options } = {}) {
        const { error } = AssetsValidator.getDefaultAssetForPlayground().validate(
            {
                options,
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
            `/service/platform/assets/v1.0/playground/default`,
            query_params,
            undefined,
        );
    }

    /**
    *
    * @summary: Get all transformation modules
    * @description: Get all transformation modules.

    * @param {Object} arg - arg object.
    * @param {Object} arg.options - extra options if avaiable 
    
    **/
    getModules({ options } = {}) {
        const { error } = AssetsValidator.getModules().validate(
            {
                options,
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
    * @param {Object} arg.options - extra options if avaiable 
    * @param {string} arg.identifier - identifier of Transformation Module
    
    **/
    getModule({ options, identifier } = {}) {
        const { error } = AssetsValidator.getModule().validate(
            {
                options,
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

    /**
    *
    * @summary: Add a preset.
    * @description: Add a preset for an organization.

    * @param {Object} arg - arg object.
    * @param {Object} arg.options - extra options if avaiable     
    * @param {string} arg.presetName Name of the preset
    * @param {string} arg.transformation A chain of transformations, separated by `~`
    * @param {object} arg.params Parameters object for transformation variables
    
    **/
    addPreset({
        options,

        presetName,
        transformation,
        params,
    } = {}) {
        const { error } = AssetsValidator.addPreset().validate(
            {
                options,

                body: { presetName, transformation, params },
            },
            { abortEarly: false },
        );
        if (error) {
            return Promise.reject(new PDKClientValidationError(error));
        }

        const query_params = {};

        let body;

        body = {
            presetName,
            transformation,
            params,
        };

        return PlatformAPIClient.execute(
            this.config,
            "post",
            `/service/platform/assets/v1.0/presets`,
            query_params,
            body,
            "application/json",
        );
    }

    /**
    *
    * @summary: Get presets for an organization
    * @description: Retrieve presets for a specific organization.
    * @param {Object} arg - arg object.
    * @param {Object} arg.options - extra options if avaiable 
    * @param {number} [arg.pageNo] - Page number
    * @param {number} [arg.pageSize] - Page size
    * @param {string} [arg.name] - Preset name
    * @param {string} [arg.transformation] - Transformation applied
    * @param {boolean} [arg.archived] - Indicates whether the preset is archived or not
    * @param {Array<string>} [arg.sort] - Sort the results by a specific key
    
    **/
    getPresets({ options, pageNo, pageSize, name, transformation, archived, sort } = {}) {
        const { error } = AssetsValidator.getPresets().validate(
            {
                options,
                pageNo,
                pageSize,
                name,
                transformation,
                archived,
                sort,
            },
            { abortEarly: false },
        );
        if (error) {
            return Promise.reject(new PDKClientValidationError(error));
        }

        const query_params = {};
        query_params["pageNo"] = pageNo;
        query_params["pageSize"] = pageSize;
        query_params["name"] = name;
        query_params["transformation"] = transformation;
        query_params["archived"] = archived;
        if (sort && sort instanceof Array && sort.join("")) {
            sort.forEach((param, idx) => {
                query_params[`sort[${idx}]`] = param;
            });
        }

        return PlatformAPIClient.execute(
            this.config,
            "get",
            `/service/platform/assets/v1.0/presets`,
            query_params,
            undefined,
        );
    }

    /**
    *
    * @summary: Update a preset.
    * @description: Update a preset of an organization.

    * @param {Object} arg - arg object.
    * @param {Object} arg.options - extra options if avaiable     
    * @param {string} arg.presetName - Name of the preset to be updated
    * @param {boolean} arg.archived Indicates if the preset has been archived
    
    **/
    updatePreset({ options, presetName, archived } = {}) {
        const { error } = AssetsValidator.updatePreset().validate(
            {
                options,
                presetName,
                body: { archived },
            },
            { abortEarly: false },
        );
        if (error) {
            return Promise.reject(new PDKClientValidationError(error));
        }

        const query_params = {};

        let body;

        body = {
            archived,
        };

        return PlatformAPIClient.execute(
            this.config,
            "patch",
            `/service/platform/assets/v1.0/presets/${presetName}`,
            query_params,
            body,
            "application/json",
        );
    }

    /**
    *
    * @summary: Delete a preset.
    * @description: Delete a preset of an organization.

    * @param {Object} arg - arg object.
    * @param {Object} arg.options - extra options if avaiable 
    * @param {string} arg.presetName - Name of the preset to be deleted
    
    **/
    deletePreset({ options, presetName } = {}) {
        const { error } = AssetsValidator.deletePreset().validate(
            {
                options,
                presetName,
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
            `/service/platform/assets/v1.0/presets/${presetName}`,
            query_params,
            undefined,
        );
    }

    /**
    *
    * @summary: Get a preset.
    * @description: Get a preset of an organization.

    * @param {Object} arg - arg object.
    * @param {Object} arg.options - extra options if avaiable 
    * @param {string} arg.presetName - Name of the preset to be fetched
    
    **/
    getPreset({ options, presetName } = {}) {
        const { error } = AssetsValidator.getPreset().validate(
            {
                options,
                presetName,
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
            `/service/platform/assets/v1.0/presets/${presetName}`,
            query_params,
            undefined,
        );
    }

    /**
    *
    * @summary: Upload File
    * @description: Upload File to Pixelbin
    * @param {Object} arg - arg object.
    * @param {Object} arg.options - extra options if avaiable    
    * @param {file} arg.file Asset file
    * @param {string} arg.path Path where you want to store the asset
    * @param {string} arg.name Name of the asset, if not provided name of the file will be used. Note - The provided name will be slugified to make it URL safe
    * @param {AccessEnum} arg.access Access level of asset, can be either `public-read` or `private`
    * @param {[string]} arg.tags Asset tags
    * @param {object} arg.metadata Asset related metadata
    * @param {boolean} arg.overwrite Overwrite flag. If set to `true` will overwrite any file that exists with same path, name and type. Defaults to `false`.
    * @param {boolean} arg.filenameOverride If set to `true` will add unique characters to name if asset with given name already exists. If overwrite flag is set to `true`, preference will be given to overwrite flag. If both are set to `false` an error will be raised.
    
    **/
    fileUpload({
        options,

        file,
        path,
        name,
        access,
        tags,
        metadata,
        overwrite,
        filenameOverride,
    } = {}) {
        const { error } = AssetsValidator.fileUpload().validate(
            {
                options,

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

        if (file) body.append("file", file, { filename: options && options.originalFilename });
        if (path) body.append("path", path);
        if (name) body.append("name", name);
        if (access) body.append("access", access);
        if (tags) tags.forEach((prop) => body.append("tags", prop));
        if (metadata) body.append("metadata", JSON.stringify(metadata));
        if (overwrite) body.append("overwrite", overwrite.toString());
        if (filenameOverride) body.append("filenameOverride", filenameOverride.toString());

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
    * @param {Object} arg.options - extra options if avaiable     
    * @param {string} arg.url Asset URL
    * @param {string} arg.path Path where you want to store the asset
    * @param {string} arg.name Name of the asset, if not provided name of the file will be used. Note - The provided name will be slugified to make it URL safe
    * @param {AccessEnum} arg.access Access level of asset, can be either `public-read` or `private`
    * @param {[string]} arg.tags Asset tags
    * @param {object} arg.metadata Asset related metadata
    * @param {boolean} arg.overwrite Overwrite flag. If set to `true` will overwrite any file that exists with same path, name and type. Defaults to `false`.
    * @param {boolean} arg.filenameOverride If set to `true` will add unique characters to name if asset with given name already exists. If overwrite flag is set to `true`, preference will be given to overwrite flag. If both are set to `false` an error will be raised.
    
    **/
    urlUpload({
        options,

        url,
        path,
        name,
        access,
        tags,
        metadata,
        overwrite,
        filenameOverride,
    } = {}) {
        const { error } = AssetsValidator.urlUpload().validate(
            {
                options,

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
    * @param {Object} arg.options - extra options if avaiable     
    * @param {string} arg.name name of the file
    * @param {string} arg.path Path of the file
    * @param {string} arg.format Format of the file
    * @param {AccessEnum} arg.access Access level of asset, can be either `public-read` or `private`
    * @param {[string]} arg.tags Tags associated with the file.
    * @param {object} arg.metadata Metadata associated with the file.
    * @param {boolean} arg.overwrite Overwrite flag. If set to `true` will overwrite any file that exists with same path, name and type. Defaults to `false`.
    * @param {boolean} arg.filenameOverride If set to `true` will add unique characters to name if asset with given name already exists. If overwrite flag is set to `true`, preference will be given to overwrite flag. If both are set to `false` an error will be raised.
    
    **/
    createSignedUrl({
        options,

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
                options,

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
    * @summary: Signed multipart upload
    * @description: For the given asset details, a presigned URL will be generated, which can be then used to upload your asset in chunks via multipart upload.
    * @param {Object} arg - arg object.
    * @param {Object} arg.options - extra options if avaiable     
    * @param {string} arg.name name of the file
    * @param {string} arg.path Path of containing folder.
    * @param {string} arg.format Format of the file
    * @param {AccessEnum} arg.access Access level of asset, can be either `public-read` or `private`
    * @param {[string]} arg.tags Tags associated with the file.
    * @param {object} arg.metadata Metadata associated with the file.
    * @param {boolean} arg.overwrite Overwrite flag. If set to `true` will overwrite any file that exists with same path, name and type. Defaults to `false`.
    * @param {boolean} arg.filenameOverride If set to `true` will add unique characters to name if asset with given name already exists. If overwrite flag is set to `true`, preference will be given to overwrite flag. If both are set to `false` an error will be raised.
    * @param {integer} arg.expiry Expiry time in seconds for the signed URL. Defaults to 3000 seconds.
    
    **/
    createSignedUrlV2({
        options,

        name,
        path,
        format,
        access,
        tags,
        metadata,
        overwrite,
        filenameOverride,
        expiry,
    } = {}) {
        const { error } = AssetsValidator.createSignedUrlV2().validate(
            {
                options,

                body: {
                    name,
                    path,
                    format,
                    access,
                    tags,
                    metadata,
                    overwrite,
                    filenameOverride,
                    expiry,
                },
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
            expiry,
        };

        return PlatformAPIClient.execute(
            this.config,
            "post",
            `/service/platform/assets/v2.0/upload/signed-url`,
            query_params,
            body,
            "application/json",
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
    * @description: Get App and org details
    * @param {Object} arg - arg object.
    * @param {Object} arg.options - extra options if avaiable 
    
    **/
    getAppOrgDetails({ options } = {}) {
        const { error } = OrganizationValidator.getAppOrgDetails().validate(
            {
                options,
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
            `/service/platform/organization/v1.0/apps/info`,
            query_params,
            undefined,
        );
    }
}

class Transformation {
    constructor(config) {
        this.config = config;
    }

    /**
    *
    * @summary: Get transformation context
    * @description: Get transformation context
    * @param {Object} arg - arg object.
    * @param {Object} arg.options - extra options if avaiable 
    * @param {string} [arg.url] - CDN URL with transformation.
    
    **/
    getTransformationContext({ options, url } = {}) {
        const { error } = TransformationValidator.getTransformationContext().validate(
            {
                options,
                url,
            },
            { abortEarly: false },
        );
        if (error) {
            return Promise.reject(new PDKClientValidationError(error));
        }

        const query_params = {};
        query_params["url"] = url;

        return PlatformAPIClient.execute(
            this.config,
            "get",
            `/service/platform/transformation/context`,
            query_params,
            undefined,
        );
    }
}

class Billing {
    constructor(config) {
        this.config = config;
    }

    /**
    *
    * @summary: Get current usage of organization
    * @description: Get current usage of organization
    * @param {Object} arg - arg object.
    * @param {Object} arg.options - extra options if avaiable 
    
    **/
    getUsageV2({ options } = {}) {
        const { error } = BillingValidator.getUsageV2().validate(
            {
                options,
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
            `/service/platform/payment/v1.0/usage`,
            query_params,
            undefined,
        );
    }

    /**
    *
    * @summary: Get current subscription usage of organization
    * @description: This API endpoint is deprecated and will be discontinued in the future. It does not include add-on details in the subscription usage data.
    * @param {Object} arg - arg object.
    * @param {Object} arg.options - extra options if avaiable 
    
    **/
    getUsage({ options } = {}) {
        const { error } = BillingValidator.getUsage().validate(
            {
                options,
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
            `/service/platform/payment/v1.0/usage/subscription`,
            query_params,
            undefined,
        );
    }
}

module.exports = PixelbinClient;
