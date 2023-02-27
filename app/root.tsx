import type { LinksFunction, MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import globalStylesUrl from "~/styles/global-styles.css";
import resetStyles from "~/styles/reset.css";

export const meta: MetaFunction = () => {
  return {
    charset: "utf-8",
    viewport: "width=device-width,initial-scale=1",
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
    { rel: "preconnect", href: "https://fonts.googleapis.com" },
    {
      rel: "preconnect",
      href: "https://fonts.gstatic.com",
      crossOrigin: "anonymous",
    },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Jost:wght@400;500;600;700&display=swap",
    },
    { rel: "stylesheet", href: resetStyles },
    { rel: "stylesheet", href: globalStylesUrl },
  ];
};

export default function App() {
  return (
    <html lang="en">
      <head>
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
