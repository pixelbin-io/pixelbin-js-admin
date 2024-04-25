const Joi = require("joi");
class Validator {
    static folderItem() {
        return Joi.object({
            _id: Joi.string().allow(""),

            orgId: Joi.number(),

            name: Joi.string().allow(""),

            path: Joi.string().allow(""),

            type: Joi.string().allow(""),
        });
    }

    static exploreItem() {
        return Joi.object({
            _id: Joi.string().allow(""),

            orgId: Joi.number(),

            name: Joi.string().allow(""),

            type: Joi.string().allow(""),

            path: Joi.string().allow(""),

            fileId: Joi.string().allow(""),

            format: Joi.string().allow(""),

            size: Joi.number(),

            access: this.AccessEnum(),

            s3Bucket: Joi.string().allow(""),

            s3Key: Joi.string().allow(""),
        });
    }

    static page() {
        return Joi.object({
            type: Joi.string().allow("").required(),

            size: Joi.number().required(),

            current: Joi.number().required(),

            hasNext: Joi.boolean().required(),

            itemTotal: Joi.number().required(),
        });
    }

    static exploreResponse() {
        return Joi.object({
            items: Joi.array().items(this.exploreItem()).required(),

            page: this.page().required(),
        });
    }

    static ListFilesResponse() {
        return Joi.object({
            items: Joi.array().items(this.exploreItem()),

            page: this.page(),
        });
    }

    static FileUploadRequest() {
        return Joi.object({
            file: Joi.object({ pipe: Joi.func().required() }).unknown().required(),

            path: Joi.string().allow(""),

            name: Joi.string().allow(""),

            access: this.AccessEnum(),

            tags: Joi.array().items(Joi.string().allow("")),

            metadata: Joi.object(),

            overwrite: Joi.boolean(),

            filenameOverride: Joi.boolean(),
        });
    }

    static UrlUploadRequest() {
        return Joi.object({
            url: Joi.string().allow("").required(),

            path: Joi.string().allow(""),

            name: Joi.string().allow(""),

            access: this.AccessEnum(),

            tags: Joi.array().items(Joi.string().allow("")),

            metadata: Joi.object(),

            overwrite: Joi.boolean(),

            filenameOverride: Joi.boolean(),
        });
    }

    static UploadResponse() {
        return Joi.object({
            _id: Joi.string().allow("").required(),

            fileId: Joi.string().allow("").required(),

            name: Joi.string().allow("").required(),

            path: Joi.string().allow("").required(),

            format: Joi.string().allow("").required(),

            size: Joi.number().required(),

            access: this.AccessEnum().required(),

            tags: Joi.array().items(Joi.string().allow("")),

            metadata: Joi.object(),

            url: Joi.string().allow(""),

            thumbnail: Joi.string().allow(""),
        });
    }

    static SignedUploadRequest() {
        return Joi.object({
            name: Joi.string().allow(""),

            path: Joi.string().allow(""),

            format: Joi.string().allow(""),

            access: this.AccessEnum(),

            tags: Joi.array().items(Joi.string().allow("")),

            metadata: Joi.object(),

            overwrite: Joi.boolean(),

            filenameOverride: Joi.boolean(),
        });
    }

    static SignedUploadResponse() {
        return Joi.object({
            s3PresignedUrl: this.PresignedUrl().required(),
        });
    }

    static PresignedUrl() {
        return Joi.object({
            url: Joi.string().allow(""),

            fields: Joi.object(),
        });
    }

    static FilesResponse() {
        return Joi.object({
            _id: Joi.string().allow("").required(),

            name: Joi.string().allow("").required(),

            path: Joi.string().allow("").required(),

            fileId: Joi.string().allow("").required(),

            format: Joi.string().allow("").required(),

            size: Joi.number().required(),

            access: this.AccessEnum().required(),

            isActive: Joi.boolean().required(),

            tags: Joi.array().items(Joi.string().allow("")),

            metadata: Joi.object(),

            url: Joi.string().allow(""),

            thumbnail: Joi.string().allow(""),
        });
    }

    static UpdateFileRequest() {
        return Joi.object({
            name: Joi.string().allow(""),

            path: Joi.string().allow(""),

            access: this.AccessEnum(),

            isActive: Joi.boolean(),

            tags: Joi.array().items(Joi.string().allow("")),

            metadata: Joi.object(),
        });
    }

    static FoldersResponse() {
        return Joi.object({
            _id: Joi.string().allow("").required(),

            name: Joi.string().allow("").required(),

            path: Joi.string().allow("").required(),

            isActive: Joi.boolean().required(),
        });
    }

    static CreateFolderRequest() {
        return Joi.object({
            name: Joi.string().allow("").required(),

            path: Joi.string().allow(""),
        });
    }

    static UpdateFolderRequest() {
        return Joi.object({
            isActive: Joi.boolean(),
        });
    }

    static DeleteMultipleFilesRequest() {
        return Joi.object({
            ids: Joi.array().items(Joi.string().allow("")).required(),
        });
    }

    static Delimiter() {
        return Joi.object({
            operationSeparator: Joi.string().allow(""),

            parameterSeparator: Joi.string().allow(""),
        });
    }

    static AddCredentialsRequest() {
        return Joi.object({
            credentials: Joi.object().required(),

            pluginId: Joi.string().allow("").required(),
        });
    }

    static UpdateCredentialsRequest() {
        return Joi.object({
            credentials: Joi.object().required(),
        });
    }

    static AddCredentialsResponse() {
        return Joi.object({
            credentials: Joi.object(),
        });
    }

    static GetAncestorsResponse() {
        return Joi.object({
            folder: this.folderItem(),

            ancestors: Joi.array().items(this.FoldersResponse()),
        });
    }

    static AddPresetRequest() {
        return Joi.object({
            presetName: Joi.string().allow("").required(),

            transformation: Joi.string().allow("").required(),

            params: Joi.object(),
        });
    }

    static AddPresetResponse() {
        return Joi.object({
            presetName: Joi.string().allow(""),

            transformation: Joi.string().allow(""),

            params: Joi.object(),

            archived: Joi.boolean(),

            orgId: Joi.number(),

            isActive: Joi.boolean(),

            createdAt: Joi.string().allow(""),

            updatedAt: Joi.string().allow(""),
        });
    }

    static UpdatePresetRequest() {
        return Joi.object({
            archived: Joi.boolean().required(),
        });
    }

    static GetPresetsResponse() {
        return Joi.object({
            items: Joi.array().items(this.AddPresetResponse()).required(),

            page: this.page().required(),
        });
    }

    static TransformationModuleResponse() {
        return Joi.object({
            identifier: Joi.string().allow(""),

            name: Joi.string().allow(""),

            description: Joi.string().allow(""),

            credentials: Joi.object(),

            operations: Joi.array().items(Joi.string().allow("")),

            enabled: Joi.boolean(),
        });
    }

    static TransformationModulesResponse() {
        return Joi.object({
            delimiters: this.Delimiter(),

            plugins: Joi.object().pattern(/\S/, this.TransformationModuleResponse()),

            presets: Joi.array().items(Joi.string().allow("")),
        });
    }

    static SignedUploadRequestV2() {
        return Joi.object({
            name: Joi.string().allow(""),

            path: Joi.string().allow(""),

            format: Joi.string().allow(""),

            access: this.AccessEnum(),

            tags: Joi.array().items(Joi.string().allow("")),

            metadata: Joi.object(),

            overwrite: Joi.boolean(),

            filenameOverride: Joi.boolean(),

            expiry: Joi.number(),
        });
    }

    static SignedUploadV2Response() {
        return Joi.object({
            presignedUrl: this.PresignedUrlV2().required(),
        });
    }

    static PresignedUrlV2() {
        return Joi.object({
            url: Joi.string().allow(""),

            fields: Joi.object().pattern(/\S/, Joi.string().allow("")),
        });
    }

    /*
        Enum: AccessEnum
        Used By: Assets
    */
    static AccessEnum() {
        return Joi.string().valid(
            "public-read",

            "private",
        );
    }

    static OrganizationDetailSchema() {
        return Joi.object({
            _id: Joi.number(),

            name: Joi.string().allow(""),

            cloudName: Joi.string().allow(""),

            ownerId: Joi.string().allow(""),

            active: Joi.boolean(),

            createdAt: Joi.string().allow(""),

            updatedAt: Joi.string().allow(""),
        });
    }

    static AppSchema() {
        return Joi.object({
            _id: Joi.number(),

            orgId: Joi.number(),

            name: Joi.string().allow(""),

            token: Joi.string().allow(""),

            permissions: Joi.array().items(Joi.string().allow("")),

            active: Joi.boolean(),

            createdAt: Joi.string().allow(""),

            updatedAt: Joi.string().allow(""),
        });
    }

    static AppOrgDetails() {
        return Joi.object({
            app: this.AppSchema(),

            org: this.OrganizationDetailSchema(),
        });
    }

    static ErrorSchema() {
        return Joi.object({
            message: Joi.string().allow(""),
        });
    }

    static GetTransformationContextSuccessResponse() {
        return Joi.object({
            context: Joi.object(),
        });
    }

    static NotFoundSchema() {
        return Joi.object({
            message: Joi.string().allow(""),
        });
    }

    static UsageSchema() {
        return Joi.object({
            storage: Joi.string().allow(""),
        });
    }

    static ConsumedCreditsSchema() {
        return Joi.object({
            used: Joi.number(),
        });
    }

    static TotalUsageSchema() {
        return Joi.object({
            credits: Joi.number(),

            storage: Joi.number(),
        });
    }

    static CompleteUsageSchema() {
        return Joi.object({
            credits: this.ConsumedCreditsSchema(),

            total: this.TotalUsageSchema(),

            usage: this.UsageSchema(),
        });
    }

    static StorageUsageSchema() {
        return Joi.object({
            total: Joi.number(),

            used: Joi.number(),
        });
    }

    static CreditUsageSchema() {
        return Joi.object({
            total: Joi.number(),

            used: Joi.number(),
        });
    }

    static PixelbinUsageSchema() {
        return Joi.object({
            storage: this.StorageUsageSchema(),

            credits: this.CreditUsageSchema(),
        });
    }
}

class AssetsValidator {
    static addCredentials() {
        return Joi.object({
            options: Joi.object(),
            body: Validator.AddCredentialsRequest().required(),
        }).required();
    }

    static updateCredentials() {
        return Joi.object({
            options: Joi.object(),
            pluginId: Joi.string().allow("").required(),
            body: Validator.UpdateCredentialsRequest().required(),
        }).required();
    }

    static deleteCredentials() {
        return Joi.object({
            options: Joi.object(),
            pluginId: Joi.string().allow("").required(),
        }).required();
    }

    static getFileById() {
        return Joi.object({
            options: Joi.object(),
            _id: Joi.string().allow("").required(),
        }).required();
    }

    static getFileByFileId() {
        return Joi.object({
            options: Joi.object(),
            fileId: Joi.string().allow("").required(),
        }).required();
    }

    static updateFile() {
        return Joi.object({
            options: Joi.object(),
            fileId: Joi.string().allow("").required(),
            body: Validator.UpdateFileRequest().required(),
        }).required();
    }

    static deleteFile() {
        return Joi.object({
            options: Joi.object(),
            fileId: Joi.string().allow("").required(),
        }).required();
    }

    static deleteFiles() {
        return Joi.object({
            options: Joi.object(),
            body: Validator.DeleteMultipleFilesRequest().required(),
        }).required();
    }

    static createFolder() {
        return Joi.object({
            options: Joi.object(),
            body: Validator.CreateFolderRequest().required(),
        }).required();
    }

    static getFolderDetails() {
        return Joi.object({
            options: Joi.object(),
            path: Joi.string().allow(""),
            name: Joi.string().allow(""),
        });
    }

    static updateFolder() {
        return Joi.object({
            options: Joi.object(),
            folderId: Joi.string().allow("").required(),
            body: Validator.UpdateFolderRequest().required(),
        }).required();
    }

    static deleteFolder() {
        return Joi.object({
            options: Joi.object(),
            _id: Joi.string().allow("").required(),
        }).required();
    }

    static getFolderAncestors() {
        return Joi.object({
            options: Joi.object(),
            _id: Joi.string().allow("").required(),
        }).required();
    }

    static listFiles() {
        return Joi.object({
            options: Joi.object(),
            name: Joi.string().allow(""),
            path: Joi.string().allow(""),
            format: Joi.string().allow(""),
            tags: Joi.array().items(Joi.string().allow("")),
            onlyFiles: Joi.boolean(),
            onlyFolders: Joi.boolean(),
            pageNo: Joi.number(),
            pageSize: Joi.number(),
            sort: Joi.string().allow(""),
        });
    }

    static getDefaultAssetForPlayground() {
        return Joi.object({
            options: Joi.object(),
        });
    }

    static getModules() {
        return Joi.object({
            options: Joi.object(),
        });
    }

    static getModule() {
        return Joi.object({
            options: Joi.object(),
            identifier: Joi.string().allow("").required(),
        }).required();
    }

    static addPreset() {
        return Joi.object({
            options: Joi.object(),
            body: Validator.AddPresetRequest().required(),
        }).required();
    }

    static getPresets() {
        return Joi.object({
            options: Joi.object(),
            pageNo: Joi.number(),
            pageSize: Joi.number(),
            name: Joi.string().allow(""),
            transformation: Joi.string().allow(""),
            archived: Joi.boolean(),
            sort: Joi.array().items(Joi.string().allow("")),
        });
    }

    static updatePreset() {
        return Joi.object({
            options: Joi.object(),
            presetName: Joi.string().allow("").required(),
            body: Validator.UpdatePresetRequest().required(),
        }).required();
    }

    static deletePreset() {
        return Joi.object({
            options: Joi.object(),
            presetName: Joi.string().allow("").required(),
        }).required();
    }

    static getPreset() {
        return Joi.object({
            options: Joi.object(),
            presetName: Joi.string().allow("").required(),
        }).required();
    }

    static fileUpload() {
        return Joi.object({
            options: Joi.object(),
            body: Validator.FileUploadRequest().required(),
        }).required();
    }

    static urlUpload() {
        return Joi.object({
            options: Joi.object(),
            body: Validator.UrlUploadRequest().required(),
        }).required();
    }

    static createSignedUrl() {
        return Joi.object({
            options: Joi.object(),
            body: Validator.SignedUploadRequest().required(),
        }).required();
    }

    static createSignedUrlV2() {
        return Joi.object({
            options: Joi.object(),
            body: Validator.SignedUploadRequestV2().required(),
        }).required();
    }
}

class OrganizationValidator {
    static getAppOrgDetails() {
        return Joi.object({
            options: Joi.object(),
        });
    }
}

class TransformationValidator {
    static getTransformationContext() {
        return Joi.object({
            options: Joi.object(),
            url: Joi.string().allow(""),
        });
    }
}

class BillingValidator {
    static getUsageV2() {
        return Joi.object({
            options: Joi.object(),
        });
    }

    static getUsage() {
        return Joi.object({
            options: Joi.object(),
        });
    }
}

module.exports = {
    AssetsValidator,
    OrganizationValidator,
    TransformationValidator,
    BillingValidator,
};
