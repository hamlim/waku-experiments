/** Automatically Generated! */
import type { Route } from "../lib/router";

export let routes: Array<[string, Route]> = [
  [
    "/[...404]",
    {
      "routeType": "catch-all",
      "rawPath": "/[...404]",
      "filePath": "/[...404].page.tsx",
      "params": [
        "404"
      ],
      "type": "rsc"
    }
  ],
  [
    "/",
    {
      "routeType": "static",
      "rawPath": "/",
      "filePath": "/index.page.tsx",
      "type": "rsc",
      "params": []
    }
  ],
  [
    "/api/[...params]",
    {
      "routeType": "catch-all",
      "rawPath": "/api/[...params]",
      "filePath": "/api/[...params].route.ts",
      "params": [
        "params"
      ],
      "type": "route"
    }
  ],
  [
    "/api/foo",
    {
      "routeType": "static",
      "rawPath": "/api/foo",
      "filePath": "/api/foo.route.ts",
      "type": "route",
      "params": []
    }
  ]
];