#!/usr/bin/env node

/**
 * Script: extract-translations.js
 * Goal: Scan app/components.tsx|ts|jsx|js
 * Find t("key", "value") usages and add missing ones to translation.json
*/

import fs from "fs";
import path from "path";

// --- CONFIG ---
const COMPONENTS_DIR = path.resolve("app/components");
const TRANSLATION_FILE = path.resolve("translation.json");

// --- HELPERS ---
/** Recursively find all files under a directory */
function getAllFiles(dir, ext = [".js", ".jsx", ".ts", ".tsx"]) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach((file) => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            results = results.concat(getAllFiles(filePath, ext));
        } else if (ext.some((e) => file.endsWith(e))) {
            results.push(filePath);
        }
    });
    return results;
}

/** Extract translation key/value pairs from file content */
function extractTranslations(content) {
    const pairs = [];
    const regex = /t\(\s*["'`]([^"'`]+)["'`]\s*,\s*["'`]([^"'`]+)["'`]\s*\)/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
        const key = match[1];
        const value = match[2];
        pairs.push({ key, value });
    }
    return pairs;
}

// --- MAIN ---
function run() {
    if (!fs.existsSync(TRANSLATION_FILE)) {
        console.error(`❌ translation.json not found at project root.`);
        process.exit(1);
    }

    const existing = JSON.parse(fs.readFileSync(TRANSLATION_FILE, "utf-8"));
    const files = getAllFiles(COMPONENTS_DIR);

    let newCount = 0;

    files.forEach((file) => {
        const content = fs.readFileSync(file, "utf-8");
        if (!content.includes("useKivunovaTranslation")) return;

        const pairs = extractTranslations(content);
        pairs.forEach(({ key, value }) => {
            if (!existing[key]) {
                existing[key] = value;
                newCount++;
            }
        });
    });

    fs.writeFileSync(
        TRANSLATION_FILE,
        JSON.stringify(existing, null, 2),
        "utf-8"
    );

    console.log(
        `✅ Translation extraction completed.\n   ${newCount} new keys added to translation.json`
    );
}

run();
