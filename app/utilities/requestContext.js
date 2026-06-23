import { AsyncLocalStorage } from "node:async_hooks";

const asyncLocalStorage = new AsyncLocalStorage();

export function runWithRequest(req, callback) {
  return asyncLocalStorage.run(req, callback);
}

export function getCurrentRequest() {
  return asyncLocalStorage.getStore();
}
