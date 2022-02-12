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

import resetStylesUrl from "~/styles/reset.css";
import globalStylesUrl from "~/styles/global.css";
import buttonStylesUrl from "~/styles/button.css";

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
    { rel: "stylesheet", href: resetStylesUrl },
    { rel: "stylesheet", href: globalStylesUrl },
    { rel: "stylesheet", href: buttonStylesUrl },
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
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  );
}
