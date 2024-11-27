import { Slot } from "waku/minimal/client";
import { new_defineEntries } from "waku/minimal/server";

import { type Route, Router } from "../lib/router";
import { routes } from "./routes.gen";

let pageRoutes = new Map(
  routes.filter(([_, route]) => route.type === "rsc") as Array<[string, Route]>,
);
let pageRouter = new Router([...pageRoutes.values()]);

let apiRoutes = new Map(
  routes.filter(([_, route]) => route.type === "route") as Array<
    [string, Route]
  >,
);
let apiRouter = new Router([...apiRoutes.values()]);

const stringToStream = (str: string): ReadableStream => {
  const encoder = new TextEncoder();
  return new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode(str));
      controller.close();
    },
  });
};

async function load(path: string) {
  const DO_NOT_BUNDLE = "";
  let mod = await import(/* @vite-ignore */ `${DO_NOT_BUNDLE}./app/${path}`);
  return mod.default;
}

function TODO() {
  return (
    <html lang="en">
      <head>
        <title>TODO</title>
      </head>
      <body>TODO</body>
    </html>
  );
}

export default new_defineEntries({
  unstable_handleRequest: async (input, { renderRsc, renderHtml }) => {
    console.log(input.type, input.req.url);
    switch (input.type) {
      case "component": {
        let route = pageRouter.match(new URL(input.req.url));
        if (!route) {
          console.warn(`No page route found for ${input.req.url}`);
          return renderRsc({ App: <TODO /> });
        }
        let Component = await load(route.filePath);
        return renderRsc({ App: <Component /> });
      }
      case "function": {
        let elements: Record<string, unknown> = {};
        let rerender = (rscPath: string) => {
          elements.App = <TODO />;
        };
        // let value = await runWithRerender(rerender, () =>
        //   input.fn(...input.args),
        // );
        let value = await input.fn(...input.args);
        return renderRsc({ ...elements, _value: value });
      }
      case "custom": {
        let apiRoute = apiRouter.match(new URL(input.req.url));
        let pageRoute = pageRouter.match(new URL(input.req.url));
        if (!apiRoute) {
          if (!pageRoute) {
            console.warn(`No API or page route found for ${input.req.url}`);
            return renderHtml({ App: <TODO /> }, <Slot id="App" />, "");
          }
          let Component = await load(pageRoute.filePath);
          return renderHtml({ App: <Component /> }, <Slot id="App" />, "");
        }
        let handler = await load(apiRoute.filePath);
        return handler(input.req, {
          params: apiRoute.matchedParams,
        });
      }
      default: {
        return renderHtml({ App: <TODO /> }, <Slot id="App" />, "");
      }
    }
  },
  unstable_getBuildConfig: async () => [
    { pathSpec: [], entries: [{ rscPath: "" }] },
  ],
});
