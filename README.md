# Pixelbin Backend SDK for Javascript

Pixelbin Backend SDK for Javascript helps you integrate the core Pixelbin features with your application.

## Getting Started

Getting started with Pixelbin Backend SDK for Javascript

### Installation

```
npm install @pixelbin/admin --save
```

---

### Usage

#### Quick Example

```javascript
// import the PixelbinConfig and PixelbinClient
const { PixelbinConfig, PixelbinClient } = require("@pixelbin/admin");

// Create a config with you API_TOKEN
const config = new PixelbinConfig({
    domain: "https://api.pixelbin.io",
    apiSecret: "API_TOKEN",
});

// Create a pixelbin instance
const pixelbin = new PixelbinClient(config);

async function getData() {
    try {
        // list the assets stored on your organization's Pixelbin Storage
        const explorer = pixelbin.assets.listFilesPaginator({
            onlyFiles: true,
            pageSize: 5,
        });
        while (explorer.hasNext()) {
            const { items, page } = await explorer.next();
            console.log(page.current); // 1
            console.log(page.hasNext); // false
            console.log(page.size); // 3
            console.log(items.length); // 3
        }
    } catch (err) {
        console.log(err);
    }
}

getData();
```

## Documentation

-   [API docs](documentation/platform/README.md)
