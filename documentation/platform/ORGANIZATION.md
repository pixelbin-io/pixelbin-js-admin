##### [Back to Pixelbin API docs](./README.md)

## Organization Methods

Organization Service

-   [getAppByToken](#getappbytoken)

## Methods with example and description

### getAppByToken

**Summary**: Get App Details

```javascript
// Promise
const promise = organization.getAppByToken({
    token: string,
});

// Async/Await
const data = await organization.getAppByToken({
    token: string,
});
```

| Argument | Type   | Required | Description        |
| -------- | ------ | -------- | ------------------ |
| token    | string | yes      | Pixelbin api token |

Get App and org details with the API_TOKEN

_Returned Response:_

[AppDetailsByToken](#appdetailsbytoken)

Success. Returns a JSON object as shown below. Refer `AppDetailsByToken` for more details.

<details>
<summary><i>&nbsp; Example:</i></summary>

```json
{
    "app": {
        "_id": 123,
        "orgId": 12,
        "name": "Desktop Client App",
        "permissions": ["read", "read_write"],
        "active": false,
        "createdAt": "2021-07-15T07:47:00Z",
        "updatedAt": "2021-07-15T07:47:00Z"
    },
    "org": {
        "_id": 12,
        "name": "org_1",
        "cloudName": "testcloudname",
        "accountType": "individual",
        "industry": "Ecommerce",
        "strength": "1",
        "active": "false"
    }
}
```

</details>

---

### Schemas

#### ErrorSchema

| Properties | Type   | Nullable | Description |
| ---------- | ------ | -------- | ----------- |
| message    | string | no       |             |

---

#### AuthenticationInternalServerErrorSchema

| Properties | Type   | Nullable | Description |
| ---------- | ------ | -------- | ----------- |
| message    | string | no       |             |

---

#### CreateOrganizationBodySchema

| Properties  | Type    | Nullable | Description |
| ----------- | ------- | -------- | ----------- |
| name        | string  | no       |             |
| cloudName   | string  | no       |             |
| active      | boolean | no       |             |
| strength    | string  | no       |             |
| accountType | string  | no       |             |
| industry    | string  | no       |             |

---

#### CreateOrganizationResponseSchema

| Properties | Type                                                          | Nullable | Description |
| ---------- | ------------------------------------------------------------- | -------- | ----------- |
| detail     | [OrganizationDetailSchema](#organizationdetailschema)         | no       |             |
| preference | [OrganizationPreferenceSchema](#organizationpreferenceschema) | no       |             |

---

#### OrganizationResponseSchema

| Properties | Type                                                  | Nullable | Description |
| ---------- | ----------------------------------------------------- | -------- | ----------- |
| org        | [OrganizationDetailSchema](#organizationdetailschema) | no       |             |

---

#### OrganizationsResponseSchema

| Properties | Type                                                    | Nullable | Description |
| ---------- | ------------------------------------------------------- | -------- | ----------- |
| items      | [[OrganizationDetailSchema](#organizationdetailschema)] | no       |             |

---

#### OrganizationDetailSchema

| Properties | Type    | Nullable | Description |
| ---------- | ------- | -------- | ----------- |
| \_id       | number  | no       |             |
| name       | string  | no       |             |
| cloudName  | string  | no       |             |
| ownerId    | string  | no       |             |
| active     | boolean | no       |             |
| createdAt  | string  | no       |             |
| modifiedAt | string  | no       |             |

---

#### OrganizationPreferenceSchema

| Properties  | Type   | Nullable | Description |
| ----------- | ------ | -------- | ----------- |
| \_id        | number | no       |             |
| orgId       | number | no       |             |
| strength    | string | no       |             |
| accountType | string | no       |             |
| industry    | string | no       |             |
| createdAt   | string | no       |             |
| modifiedAt  | string | no       |             |

---

#### CreateAppBodySchema

| Properties  | Type     | Nullable | Description |
| ----------- | -------- | -------- | ----------- |
| name        | string   | no       |             |
| permissions | [string] | no       |             |
| active      | boolean  | no       |             |

---

#### UpdateAppBodySchema

| Properties  | Type     | Nullable | Description |
| ----------- | -------- | -------- | ----------- |
| name        | any      | no       |             |
| permissions | [string] | no       |             |
| active      | boolean  | no       |             |

---

#### CreateAppResponseSchema

| Properties | Type                      | Nullable | Description |
| ---------- | ------------------------- | -------- | ----------- |
| items      | [[AppSchema](#appschema)] | no       |             |

---

#### UpdateAppResponseSchema

| Properties | Type                      | Nullable | Description |
| ---------- | ------------------------- | -------- | ----------- |
| items      | [[AppSchema](#appschema)] | no       |             |

---

#### AppsSchema

| Properties | Type                      | Nullable | Description |
| ---------- | ------------------------- | -------- | ----------- |
| items      | [[AppSchema](#appschema)] | no       |             |

---

#### AppSchema

| Properties  | Type     | Nullable | Description |
| ----------- | -------- | -------- | ----------- |
| \_id        | number   | no       |             |
| orgId       | number   | no       |             |
| name        | string   | no       |             |
| token       | string   | no       |             |
| permissions | [string] | no       |             |
| active      | boolean  | no       |             |
| createdAt   | string   | no       |             |
| updatedAt   | string   | no       |             |

---

#### CreateTeamBodySchema

| Properties  | Type     | Nullable | Description |
| ----------- | -------- | -------- | ----------- |
| userId      | string   | no       |             |
| type        | string   | no       |             |
| permissions | [string] | no       |             |

---

#### UpdateTeamBodySchema

| Properties  | Type     | Nullable | Description |
| ----------- | -------- | -------- | ----------- |
| permissions | [string] | no       |             |

---

#### TeamsSchema

| Properties | Type                        | Nullable | Description |
| ---------- | --------------------------- | -------- | ----------- |
| items      | [[TeamSchema](#teamschema)] | no       |             |

---

#### TeamSchema

| Properties  | Type     | Nullable | Description |
| ----------- | -------- | -------- | ----------- |
| \_id        | number   | no       |             |
| orgId       | number   | no       |             |
| userId      | string   | no       |             |
| type        | string   | no       |             |
| permissions | [string] | no       |             |
| createdAt   | string   | no       |             |
| updatedAt   | string   | no       |             |

---

#### AppDetailsByToken

| Properties | Type                                                  | Nullable | Description |
| ---------- | ----------------------------------------------------- | -------- | ----------- |
| app        | [AppSchema](#appschema)                               | no       |             |
| org        | [OrganizationDetailSchema](#organizationdetailschema) | no       |             |

---
