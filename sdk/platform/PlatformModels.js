const Joi = require("joi");
class Validator {
    static folderItem() {
        return Joi.object({
            _id: Joi.string().allow("").required(),

            name: Joi.string().allow("").required(),

            path: Joi.string().allow("").required(),

            type: Joi.string().allow("").required(),
        });
    }

    static exploreItem() {
        return Joi.object({
            _id: Joi.string().allow("").required(),

            name: Joi.string().allow("").required(),

            type: Joi.string().allow("").required(),

            path: Joi.string().allow("").required(),

            fileId: Joi.string().allow(""),

            format: Joi.string().allow(""),

            size: Joi.number(),

            access: Joi.string().allow(""),
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

    static exploreFolderResponse() {
        return Joi.object({
            folder: this.folderItem().required(),

            items: Joi.array().items(this.exploreItem()).required(),

            page: this.page().required(),
        });
    }

    static FileUploadRequest() {
        return Joi.object({
            file: Joi.object({ pipe: Joi.func().required() }).unknown().required(),

            path: Joi.string().allow(""),

            name: Joi.string().allow(""),

            access: Joi.string().allow(""),

            tags: Joi.array().items(Joi.string().allow("")),

            metadata: Joi.any(),

            overwrite: Joi.boolean(),

            filenameOverride: Joi.boolean(),
        });
    }

    static UrlUploadRequest() {
        return Joi.object({
            url: Joi.string().allow("").required(),

            path: Joi.string().allow(""),

            name: Joi.string().allow(""),

            access: Joi.string().allow(""),

            tags: Joi.array().items(Joi.string().allow("")),

            metadata: Joi.any(),

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

            access: Joi.string().allow("").required(),

            tags: Joi.array().items(Joi.string().allow("")),

            metadata: Joi.any(),

            url: Joi.string().allow(""),

            thumbnail: Joi.string().allow(""),
        });
    }

    static SignedUploadRequest() {
        return Joi.object({
            name: Joi.string().allow(""),

            path: Joi.string().allow(""),

            format: Joi.string().allow(""),

            access: Joi.string().allow(""),

            tags: Joi.array().items(Joi.string().allow("")),

            metadata: Joi.any(),

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

            fields: Joi.any(),
        });
    }

    static BulkUploadItem() {
        return Joi.object({
            url: Joi.string().allow("").required(),

            name: Joi.string().allow(""),

            path: Joi.string().allow(""),

            access: Joi.string().allow(""),

            tags: Joi.array().items(Joi.string().allow("")),

            metadata: Joi.any(),

            overwrite: Joi.boolean(),
        });
    }

    static BulkUploadRequest() {
        return Joi.object({
            urls: Joi.array().items(this.BulkUploadItem()).required(),
        });
    }

    static BulkUploadResponse() {
        return Joi.object({
            message: Joi.string().allow("").required(),

            taskId: Joi.string().allow("").required(),

            progress: Joi.number().required(),
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

            access: Joi.string().allow("").required(),

            isActive: Joi.boolean().required(),

            tags: Joi.array().items(Joi.string().allow("")),

            metadata: Joi.any(),

            url: Joi.string().allow(""),

            thumbnail: Joi.string().allow(""),
        });
    }

    static UpdateFileRequest() {
        return Joi.object({
            name: Joi.string().allow("").required(),

            path: Joi.string().allow("").required(),

            access: Joi.string().allow("").required(),

            isActive: Joi.boolean().required(),

            tags: Joi.array().items(Joi.string().allow("")),

            metadata: Joi.any(),
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

            path: Joi.string().allow("").required(),
        });
    }

    static UpdateFolderRequest() {
        return Joi.object({
            isActive: Joi.boolean(),
        });
    }

    static JobItem() {
        return Joi.object({
            id: Joi.string().allow(""),
        });
    }

    static GetJobsResponse() {
        return Joi.object({
            jobs: Joi.array().items(this.JobItem()),
        });
    }

    static TransformationsResponse() {
        return Joi.object({
            delimiters: this.Delimiter(),

            plugins: Joi.object().pattern(/\S/, this.TransformationResponse()),

            presets: Joi.array().items(Joi.string().allow("")),
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

    static TransformationResponse() {
        return Joi.object({
            identifier: Joi.string().allow(""),

            name: Joi.string().allow(""),

            description: Joi.string().allow(""),

            credentials: Joi.any(),

            operations: Joi.array().items(Joi.string().allow("")),

            enabled: undefined,
        });
    }

    static ErrorSchema() {
        return Joi.object({
            message: Joi.string().allow(""),
        });
    }

    static AuthenticationInternalServerErrorSchema() {
        return Joi.object({
            message: Joi.string().allow(""),
        });
    }

    static CreateOrganizationBodySchema() {
        return Joi.object({
            name: Joi.string().allow(""),

            cloudName: Joi.string().allow(""),

            active: Joi.boolean(),

            strength: Joi.string().allow(""),

            accountType: Joi.string().allow(""),

            industry: Joi.string().allow(""),
        });
    }

    static CreateOrganizationResponseSchema() {
        return Joi.object({
            detail: this.OrganizationDetailSchema(),

            preference: this.OrganizationPreferenceSchema(),
        });
    }

    static OrganizationResponseSchema() {
        return Joi.object({
            org: this.OrganizationDetailSchema(),
        });
    }

    static OrganizationsResponseSchema() {
        return Joi.object({
            items: Joi.array().items(this.OrganizationDetailSchema()),
        });
    }

    static OrganizationDetailSchema() {
        return Joi.object({
            _id: Joi.number(),

            name: Joi.string().allow(""),

            cloudName: Joi.string().allow(""),

            ownerId: Joi.string().allow(""),

            active: Joi.boolean(),

            createdAt: Joi.string().allow(""),

            modifiedAt: Joi.string().allow(""),
        });
    }

    static OrganizationPreferenceSchema() {
        return Joi.object({
            _id: Joi.number(),

            orgId: Joi.number(),

            strength: Joi.string().allow(""),

            accountType: Joi.string().allow(""),

            industry: Joi.string().allow(""),

            createdAt: Joi.string().allow(""),

            modifiedAt: Joi.string().allow(""),
        });
    }

    static CreateAppBodySchema() {
        return Joi.object({
            name: Joi.string().allow(""),

            permissions: Joi.array().items(Joi.string().allow("")),

            active: Joi.boolean(),
        });
    }

    static UpdateAppBodySchema() {
        return Joi.object({
            name: Joi.any(),

            permissions: Joi.array().items(Joi.string().allow("")),

            active: Joi.boolean(),
        });
    }

    static CreateAppResponseSchema() {
        return Joi.object({
            items: Joi.array().items(this.AppSchema()),
        });
    }

    static UpdateAppResponseSchema() {
        return Joi.object({
            items: Joi.array().items(this.AppSchema()),
        });
    }

    static AppsSchema() {
        return Joi.object({
            items: Joi.array().items(this.AppSchema()),
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

    static CreateTeamBodySchema() {
        return Joi.object({
            userId: Joi.string().allow(""),

            type: Joi.string().allow(""),

            permissions: Joi.array().items(Joi.string().allow("")),
        });
    }

    static UpdateTeamBodySchema() {
        return Joi.object({
            permissions: Joi.array().items(Joi.string().allow("")),
        });
    }

    static TeamsSchema() {
        return Joi.object({
            items: Joi.array().items(this.TeamSchema()),
        });
    }

    static TeamSchema() {
        return Joi.object({
            _id: Joi.number(),

            orgId: Joi.number(),

            userId: Joi.string().allow(""),

            type: Joi.string().allow(""),

            permissions: Joi.array().items(Joi.string().allow("")),

            createdAt: Joi.string().allow(""),

            updatedAt: Joi.string().allow(""),
        });
    }

    static AppDetailsByToken() {
        return Joi.object({
            app: this.AppSchema(),

            org: this.OrganizationDetailSchema(),
        });
    }
}

class AssetsValidator {
    static fileUpload() {
        return Joi.object({
            body: Validator.FileUploadRequest().required(),
        }).required();
    }

    static urlUpload() {
        return Joi.object({
            body: Validator.UrlUploadRequest().required(),
        }).required();
    }

    static createSignedUrl() {
        return Joi.object({
            body: Validator.SignedUploadRequest().required(),
        }).required();
    }

    static listFiles() {
        return Joi.object({
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

    static getFileById() {
        return Joi.object({
            fileId: Joi.string().allow("").required(),
        }).required();
    }

    static getFileByPath() {
        return Joi.object({
            filePath: Joi.string().allow("").required(),
        }).required();
    }

    static updateFile() {
        return Joi.object({
            filePath: Joi.string().allow("").required(),
            body: Validator.UpdateFileRequest().required(),
        }).required();
    }

    static deleteFile() {
        return Joi.object({
            filePath: Joi.string().allow("").required(),
        }).required();
    }

    static deleteFiles() {
        return Joi.object({
            body: Validator.DeleteMultipleFilesRequest().required(),
        }).required();
    }

    static createFolder() {
        return Joi.object({
            body: Validator.CreateFolderRequest().required(),
        }).required();
    }

    static updateFolder() {
        return Joi.object({
            folderId: Joi.string().allow("").required(),
            body: Validator.UpdateFolderRequest().required(),
        }).required();
    }

    static deleteFolder() {
        return Joi.object({
            folderId: Joi.string().allow("").required(),
        }).required();
    }

    static getTransformations() {
        return Joi.object({});
    }

    static getTransformationById() {
        return Joi.object({
            pluginId: Joi.string().allow("").required(),
        }).required();
    }
}

class OrganizationValidator {
    static getAppByToken() {
        return Joi.object({
            token: Joi.string().allow("").required(),
        }).required();
    }
}

module.exports = {
    AssetsValidator,
    OrganizationValidator,
};
