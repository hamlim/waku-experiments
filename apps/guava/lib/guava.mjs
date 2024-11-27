import { writeFile } from "node:fs/promises";
import { basename, extname, join as pathJoin } from "node:path";
import fastGlob from "fast-glob";

function getRouteType(filePath) {
  return basename(filePath).replace(extname(filePath), "").endsWith(".route")
    ? "route"
    : "rsc";
}

let routeFiles = await fastGlob(
  pathJoin("./src/app/", "**/*.{route,page}.{ts,tsx,js,jsx}"),
);

/**
 * @import { Route } from "./router";
 */

/**
 * @typedef {Object} RouteManifest
 * @property {Map<string, Route>} routes
 */

let routeManifest = new Map(/*<string, Route>*/);

for (let file of routeFiles) {
  let relativeFilePath = file.replace("src/app", "");
  // strip src/ prefix and file extension to get route path
  let routePath = relativeFilePath
    .replace(/\.(route|page)\.(ts|tsx|js|jsx)$/, "")
    .replace(/\/index$/, "/");

  // check if path contains dynamic segments
  if (routePath.includes("[")) {
    let params = [];
    let pathParts = routePath.split("/");

    for (let part of pathParts) {
      if (part.startsWith("[...")) {
        // catch-all segment
        params.push(part.slice(4, -1));
        routeManifest.set(routePath, {
          routeType: "catch-all",
          rawPath: routePath,
          filePath: relativeFilePath,
          params,
          type: getRouteType(relativeFilePath),
        });
        break;
      }
      if (part.startsWith("[")) {
        // dynamic segment
        params.push(part.slice(1, -1));
      }
    }

    if (!routeManifest.has(routePath)) {
      routeManifest.set(routePath, {
        routeType: "dynamic",
        rawPath: routePath,
        filePath: relativeFilePath,
        params,
        type: getRouteType(relativeFilePath),
      });
    }
  } else {
    routeManifest.set(routePath, {
      routeType: "static",
      rawPath: routePath,
      filePath: relativeFilePath,
      type: getRouteType(relativeFilePath),
      params: [],
    });
  }
}
console.log("Collected routes, writing manifest...");

await writeFile(
  pathJoin("./src/routes.gen.ts"),
  `/** Automatically Generated! */
import type { Route } from "../lib/router";

export let routes: Array<[string, Route]> = ${JSON.stringify([...routeManifest.entries()], null, 2)};`,
);

console.log("Wrote routes.gen.ts");
