import "server-only";
import { AsyncLocalStorage } from "node:async_hooks";
import type { Context } from "hono";

type Store = {
  context: Context;
};

export let storage = new AsyncLocalStorage<Store>();

export function run(providedStore: Store, cb: () => void) {
  storage.run(providedStore, cb);
}

export function get() {
  let store = storage.getStore();

  if (!store) {
    throw new Error("Unable to access the store!");
  }

  return store;
}
