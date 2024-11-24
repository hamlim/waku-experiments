import { Slot } from "waku/minimal/client";
import { new_defineEntries } from "waku/minimal/server";

import Layout from "./layout";
import About from "./pages/about";
// import App from "./components/App";
import Index from "./pages/index";

const stringToStream = (str: string): ReadableStream => {
  const encoder = new TextEncoder();
  return new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode(str));
      controller.close();
    },
  });
};

export default new_defineEntries({
  unstable_handleRequest: async (input, { renderRsc, renderHtml }) => {
    switch (input.type) {
      case "component": {
        console.log("component", input.rscPath);
        switch (input.rscPath) {
          case "Index":
            return renderRsc({ App: <Index /> });
          case "About":
            return renderRsc({ App: <About /> });
          default:
            return renderRsc({ App: <div>Not found</div> });
        }
      }
      case "custom":
        switch (input.pathname) {
          case "/":
            return renderHtml(
              {
                App: (
                  <Layout>
                    <Index />
                  </Layout>
                ),
              },
              <Slot id="App" />,
              "",
            );
          case "/about":
            return renderHtml(
              {
                App: (
                  <Layout>
                    <About />
                  </Layout>
                ),
              },
              <Slot id="App" />,
              "",
            );
          case "/api/hello":
            return stringToStream("world");
          default:
            return renderHtml(
              { App: <div>Not found</div> },
              <Slot id="App" />,
              "",
            );
        }
      default:
        return renderHtml({ App: <div>Not found</div> }, <Slot id="App" />, "");
    }
  },
  unstable_getBuildConfig: async () => [
    { pathSpec: [], entries: [{ rscPath: "" }] },
  ],
});
