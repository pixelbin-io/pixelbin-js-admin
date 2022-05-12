const { PixelbinConfig, PixelbinClient } = require(".");
const fs = require("fs");

const config = new PixelbinConfig({
    domain: "https://api.pixelbin.io",
    apiSecret: "API_TOKEN",
});
const pixelbin = new PixelbinClient(config);

pixelbin.assets
    .fileUpload({ file: fs.createReadStream("../../../1.jpeg") })
    .then((res) => {
        console.log(res);
    })
    .catch((err) => console.log(err));

const explorer = pixelbin.assets?.listFilesPaginator({ pageSize: 5 });

explorer
    ?.next()
    .then((res) => {
        console.log(res);
    })
    .catch((err) => {
        console.log(err);
    });
