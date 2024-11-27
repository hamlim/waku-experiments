import { describe, expect, it } from "bun:test";
import { Router } from "../router";

describe("Router", () => {
  it("should match static routes", () => {
    let router = new Router([
      {
        routeType: "static",
        rawPath: "/foo",
        filePath: "/foo.page.tsx",
        params: [],
        type: "rsc",
      },
    ]);

    let requestedURL = new URL("/foo", "http://localhost");
    let matchedRoute = router.match(requestedURL);

    expect(matchedRoute).toEqual({
      routeType: "static",
      params: [],
      rawPath: "/foo",
      filePath: "/foo.page.tsx",
      type: "rsc",
      matchedParams: {},
    });

    let requestedURL2 = new URL("/foo/anything", "http://localhost");
    let matchedRoute2 = router.match(requestedURL2);

    expect(matchedRoute2).toBeUndefined();
  });

  it("should match dynamic routes", () => {
    let router = new Router([
      {
        routeType: "dynamic",
        params: ["single"],
        rawPath: "/foo/[single]",
        filePath: "/foo/[single].page.tsx",
        type: "rsc",
      },
    ]);

    let requestedURL = new URL("/foo/anything", "http://localhost");
    let matchedRoute = router.match(requestedURL);

    expect(matchedRoute).toEqual({
      routeType: "dynamic",
      params: ["single"],
      rawPath: "/foo/[single]",
      filePath: "/foo/[single].page.tsx",
      type: "rsc",
      matchedParams: { single: "anything" },
    });

    let requestedURL2 = new URL("/foo/anything/else", "http://localhost");
    let matchedRoute2 = router.match(requestedURL2);

    expect(matchedRoute2).toBeUndefined();
  });

  it("should match many dynamic routes", () => {
    let router = new Router([
      {
        routeType: "dynamic",
        params: ["id"],
        rawPath: "/foo/[id]/bar",
        filePath: "/foo/[id]/bar.page.tsx",
        type: "rsc",
      },
    ]);

    let requestedURL = new URL("/foo/anything/bar", "http://localhost");
    let matchedRoute = router.match(requestedURL);

    expect(matchedRoute).toEqual({
      routeType: "dynamic",
      params: ["id"],
      rawPath: "/foo/[id]/bar",
      filePath: "/foo/[id]/bar.page.tsx",
      type: "rsc",
      matchedParams: { id: "anything" },
    });
  });

  it("should match nested dynamic routes", () => {
    let router = new Router([
      {
        routeType: "catch-all",
        params: ["nested"],
        rawPath: "/foo/[...nested]",
        filePath: "/foo/[...nested].page.tsx",
        type: "rsc",
      },
    ]);

    let requestedURL = new URL("/foo/anything", "http://localhost");
    let matchedRoute = router.match(requestedURL);

    expect(matchedRoute).toEqual({
      routeType: "catch-all",
      params: ["nested"],
      rawPath: "/foo/[...nested]",
      filePath: "/foo/[...nested].page.tsx",
      type: "rsc",
      matchedParams: { nested: ["anything"] },
    });

    let requestedURL2 = new URL("/foo/anything/else", "http://localhost");
    let matchedRoute2 = router.match(requestedURL2);

    expect(matchedRoute2).toEqual({
      routeType: "catch-all",
      params: ["nested"],
      rawPath: "/foo/[...nested]",
      filePath: "/foo/[...nested].page.tsx",
      type: "rsc",
      matchedParams: { nested: ["anything", "else"] },
    });
  });
});
