import { AsyncLocalStorage } from "node:async_hooks";

type Rerender = (rscPath: string) => void;

let store = new AsyncLocalStorage<Rerender>();

export function runWithRerender<T>(rerender: Rerender, fn: () => T): T {
  return store.run(rerender, fn);
}

export function rerender(rscPath: string) {
  let fn = store.getStore();
  if (fn) {
    fn(rscPath);
  }
}