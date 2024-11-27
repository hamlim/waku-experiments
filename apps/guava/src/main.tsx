import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { Root, Slot } from "waku/minimal/client";
import Layout from "./layout";

const rootElement = (
  <StrictMode>
    <Root>
      <Layout>
        <Slot id="App" />
      </Layout>
    </Root>
  </StrictMode>
);

if ((globalThis as any).__WAKU_HYDRATE__) {
  hydrateRoot(document, rootElement);
} else {
  createRoot(document as any).render(rootElement);
}
