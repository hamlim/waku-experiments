import { Slot } from "waku/minimal/client";
import { new_defineEntries } from "waku/minimal/server";

import { runWithRerender } from "./als";
import App from "./app";

export default new_defineEntries({
  unstable_handleRequest: async (input, { renderRsc, renderHtml }) => {
    if (input.type === "component") {
      return renderRsc({ App: <App /> });
    }
    if (input.type === "function") {
      const elements: Record<string, unknown> = {};
      const rerender = (rscPath: string) => {
        elements.App = <App />;
      };
      const value = await runWithRerender(rerender, () =>
        input.fn(...input.args),
      );
      return renderRsc({ ...elements, _value: value });
    }
    if (input.type === "custom" && input.pathname === "/") {
      return renderHtml({ App: <App /> }, <Slot id="App" />, "");
    }
  },
  unstable_getBuildConfig: async () => [
    { pathSpec: [], entries: [{ rscPath: "" }] },
  ],
});
