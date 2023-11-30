## 3.7.0

-   Added support for generating Presigned Urls for Multipart Upload. See `createSignedUrlV2` in `assets` module.
-   Fixed regex for Custom Domain URLs

## 3.5.0

-   Added support for generating `Signed PixelBin Urls`

## 3.4.0

-   Added support for parsing Custom Domains in `objToUrl` and `urlToObj`
-   Improved support for worker urls in `objToUrl` and `urlToObj`
-   Fixed documentation for `assets.deleteFiles`

## 3.3.1

-   Added .npmignore

## 3.3.0

-   Added a method for obtaining the context of a file via url.

## v3.2.0

-   Fixed tags being stringified inadvertently. If you are experiencing validation errors around `tags` in previous versions, you should upgrade your SDKs.

## v3.1.0

-   Added support for uploading files as Buffer. Please refer to README.md `For Uploading File Buffer` section.

## v3.0.0

-   `getAppByToken` has been replaced with `getAppOrgDetails`
