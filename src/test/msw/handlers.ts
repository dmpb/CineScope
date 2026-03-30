import { http, HttpResponse } from "msw";

// Base handlers for tests that prefer HTTP-level mocking.
// Current critical-flow tests use module mocks, but this keeps MSW strategy ready.
export const handlers = [
  http.get("https://api.themoviedb.org/3/*", () => {
    return HttpResponse.json({});
  })
];
