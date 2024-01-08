##### [Back to Pixelbin API docs](./README.md)

## Billing Methods

Payment Service

-   [getUsage](#getusage)

## Methods with example and description

### getUsage

**Summary**: Get current usage of organization

```javascript
// Promise

const promise = billing.getUsage();

// Async/Await

const data = await billing.getUsage();
```

Get current usage of organization

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
