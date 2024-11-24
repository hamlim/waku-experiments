import { Link } from "waku";

import { Counter } from "./components/counter";

import { rerender } from "./als";

let count = 0;

export default async function HomePage() {
  const data = await getData();

  async function increment() {
    "use server";
    count++;
    rerender("/");
    // return count;
  }

  return (
    <html lang="en">
      <body>
        <div>
          <title>{data.title}</title>
          <h1 className="text-4xl font-bold tracking-tight">{data.headline}</h1>
          <p>{data.body}</p>
          <Counter />
          <form action={increment}>
            <p>Server action counter: {count}</p>
            <button type="submit">Increment</button>
          </form>
          <Link to="/about" className="mt-4 inline-block underline">
            About page
          </Link>
        </div>
      </body>
    </html>
  );
}

const getData = async () => {
  const data = {
    title: "Waku",
    headline: "Waku",
    body: "Hello world!",
  };

  return data;
};

export const getConfig = async () => {
  return {
    render: "dynamic",
  } as const;
};
