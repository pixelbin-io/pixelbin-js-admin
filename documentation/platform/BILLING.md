##### [Back to Pixelbin API docs](./README.md)

## Billing Methods

Payment Service

-   [getUsageV2](#getusagev2)
-   [getUsage](#getusage)

## Methods with example and description

### getUsageV2

**Summary**: Get current usage of organization

```javascript
// Promise

const promise = billing.getUsageV2();

// Async/Await

const data = await billing.getUsageV2();
```

Get current usage of organization

_Returned Response:_

[PixelbinUsageSchema](#pixelbinusageschema)

Success

<details>
<summary><i>&nbsp; Example:</i></summary>

```json
{
    "storage": {
        "used": 1.0357297026862702,
        "total": 10
    },
    "credits": {
        "used": 1000,
        "total": 1
    }
}
```

</details>

---

### getUsage

**Summary**: Get current subscription usage of organization

```javascript
// Promise

const promise = billing.getUsage();

// Async/Await

const data = await billing.getUsage();
```

This API endpoint is deprecated and will be discontinued in the future. It does not include add-on details in the subscription usage data.

_Returned Response:_

[CompleteUsageSchema](#completeusageschema)

Success

<details>
<summary><i>&nbsp; Example:</i></summary>

```json
{
    "credits": {
        "used": 1.0357297026862702
    },
    "total": {
        "credits": 1000,
        "storage": 1
    },
    "usage": {
        "storage": "0"
    }
}
```

</details>

---

### Schemas

#### NotFoundSchema

| Properties | Type   | Nullable | Description |
| ---------- | ------ | -------- | ----------- |
| message    | string | no       |             |

---

#### UsageSchema

| Properties | Type   | Nullable | Description |
| ---------- | ------ | -------- | ----------- |
| storage    | string | no       |             |

---

#### ConsumedCreditsSchema

| Properties | Type   | Nullable | Description |
| ---------- | ------ | -------- | ----------- |
| used       | number | no       |             |

---

#### TotalUsageSchema

| Properties | Type   | Nullable | Description |
| ---------- | ------ | -------- | ----------- |
| credits    | number | no       |             |
| storage    | number | no       |             |

---

#### CompleteUsageSchema

| Properties | Type                                            | Nullable | Description |
| ---------- | ----------------------------------------------- | -------- | ----------- |
| credits    | [ConsumedCreditsSchema](#consumedcreditsschema) | no       |             |
| total      | [TotalUsageSchema](#totalusageschema)           | no       |             |
| usage      | [UsageSchema](#usageschema)                     | no       |             |

---

#### StorageUsageSchema

| Properties | Type   | Nullable | Description |
| ---------- | ------ | -------- | ----------- |
| total      | number | no       |             |
| used       | number | no       |             |

---

#### CreditUsageSchema

| Properties | Type   | Nullable | Description |
| ---------- | ------ | -------- | ----------- |
| total      | number | no       |             |
| used       | number | no       |             |

---

#### PixelbinUsageSchema

| Properties | Type                                      | Nullable | Description |
| ---------- | ----------------------------------------- | -------- | ----------- |
| storage    | [StorageUsageSchema](#storageusageschema) | no       |             |
| credits    | [CreditUsageSchema](#creditusageschema)   | no       |             |

---
