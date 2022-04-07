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

#### OrganizationDetailSchema

| Properties | Type    | Nullable | Description                                        |
| ---------- | ------- | -------- | -------------------------------------------------- |
| \_id       | number  | no       | Id of the organization                             |
| name       | string  | no       | Organization Name                                  |
| cloudName  | string  | no       | Unique cloud name associated with the organization |
| ownerId    | string  | no       | User Id of the organization owner                  |
| active     | boolean | no       | Whether the organization is active                 |
| createdAt  | string  | no       | Timestamp when the organization was created        |
| updatedAt  | string  | no       | Timestamp when the organization was last updated   |

---

#### AppSchema

| Properties  | Type     | Nullable | Description                             |
| ----------- | -------- | -------- | --------------------------------------- |
| \_id        | number   | no       | App id                                  |
| orgId       | number   | no       | Organization id the app belongs to      |
| name        | string   | no       | Name of the app                         |
| token       | string   | no       | api token for the app                   |
| permissions | [string] | no       | Permissions applied on the app          |
| active      | boolean  | no       | Whether the app is active               |
| createdAt   | string   | no       | Timestamp when the app was created      |
| updatedAt   | string   | no       | Timestamp when the app was last updated |

---

#### AppDetailsByToken

| Properties | Type                                                  | Nullable | Description |
| ---------- | ----------------------------------------------------- | -------- | ----------- |
| app        | [AppSchema](#appschema)                               | no       |             |
| org        | [OrganizationDetailSchema](#organizationdetailschema) | no       |             |

---

#### ErrorSchema

| Properties | Type   | Nullable | Description |
| ---------- | ------ | -------- | ----------- |
| message    | string | no       |             |

---
