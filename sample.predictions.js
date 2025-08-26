const { PixelbinConfig, PixelbinClient } = require(".");
const fs = require("fs");
const path = require("path");

// Minimal setup required from you:
// - Set PIXELBIN_API_TOKEN env var OR replace below with your token string
// - Provide an image file path (local path). Any input field can be a local file path string (read as Buffer).

const API_TOKEN = process.env.PIXELBIN_API_TOKEN || "API_TOKEN"; // replace if not using env
const DOMAIN = process.env.PIXELBIN_DOMAIN || "https://api.pixelbin.io";
const IMAGE_PATH = process.env.PREDICT_IMAGE_PATH || "result.jpeg"; // replace
const WEBHOOK = process.env.PREDICT_WEBHOOK; // optional
const NAME = process.env.PREDICT_NAME || "erase_bg"; // default name (plugin_operation)

async function main() {
  if (!API_TOKEN || API_TOKEN === "API_TOKEN") {
    console.error(
      "Please set PIXELBIN_API_TOKEN or replace API_TOKEN inline in sample.predictions.js",
    );
    process.exit(1);
  }
  // IMAGE_PATH is optional if you provide your own Buffer/Stream

  const pixelbin = new PixelbinClient(
    new PixelbinConfig({ domain: DOMAIN, apiSecret: API_TOKEN }),
  );

  try {
    console.log("\n=== list predictions ===");
    const items = await pixelbin.predictions.list();
    console.log("total:", Array.isArray(items) ? items.length : 0);

    console.log("\n=== get schema ===");
    const schema = await pixelbin.predictions.getSchema(NAME);
    console.log("schema name:", schema && schema.name);

    console.log("\n=== create ===");
    const job = await pixelbin.predictions.create({
      name: NAME,
      input: {
        // Provide Buffer or Readable stream for files; do not pass local paths directly
        image: fs.readFileSync(IMAGE_PATH),
        industry_type: process.env.PREDICT_INDUSTRY_TYPE || "general",
        quality_type: process.env.PREDICT_QUALITY_TYPE || "original",
        shadow: process.env.PREDICT_SHADOW || "false",
        refine: process.env.PREDICT_REFINE || "true",
      },
      webhook: WEBHOOK,
    });
    console.log("created job:", job);

    console.log("\n=== status (by id) ===");
    const statusById = await pixelbin.predictions.get(job._id);
    console.log("get by id:", statusById.status);

    console.log("\n=== pollUntilComplete ===");
    const finalStatus2 = await pixelbin.predictions.wait(job._id);
    console.log("wait ->", finalStatus2.status);

    console.log("\n=== check outputs (helpers) ===");
    console.log("outputs:", finalStatus2.output);

    console.log("\n=== createAndWait ===");
    const final = await pixelbin.predictions.createAndWait({
      name: NAME,
      input: {
        image: fs.readFileSync(IMAGE_PATH),
        industry_type: process.env.PREDICT_INDUSTRY_TYPE || "general",
        quality_type: process.env.PREDICT_QUALITY_TYPE || "original",
        shadow: process.env.PREDICT_SHADOW || "false",
        refine: process.env.PREDICT_REFINE || "true",
      },
      webhook: WEBHOOK,
    });
    console.log("createAndWait ->", final.status);

    console.log("\nDone.");
  } catch (err) {
    console.error("Error:", err && err.message ? err.message : err);
  }
}

main();
