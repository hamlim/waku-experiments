export default function Api(
  _request: Request,
  context: { params: Array<string> },
) {
  return new Response("Hello, world!");
}
