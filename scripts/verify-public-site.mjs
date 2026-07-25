process.env.SITE_URL ||= process.env.PUBLIC_SITE_URL || "https://4ohi.com";
process.env.SITE_RESULTS ||= process.env.PUBLIC_SITE_RESULTS || "docs/visual-evidence/palace-public-results.json";

await import("./verify-palace-site.mjs");
