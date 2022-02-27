import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "remix";
import type { MetaFunction } from "remix";
import type { LinksFunction } from "remix";

import globalStylesUrl from "~/styles/global-styles.css";

export const meta: MetaFunction = () => {
  return {
    title: "Product Feedback App | Frontend Mentor",
    description:
      "This is a solution to the Product feedback app challenge on Frontend Mentor.",
  };
};

export const links: LinksFunction = () => {
  return [
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      href: "/favicon-32x32.png",
    },
    { rel: "stylesheet", href: globalStylesUrl },
  ];
};

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div className="page">
          <Outlet />
        </div>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
