import type { LinksFunction, MetaFunction } from "react-router";
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";

import globalStylesUrl from "~/styles/global-styles.css?url";
import resetStyles from "~/styles/reset.css?url";

export const meta: MetaFunction = () => {
  return [{ title: "Product Feedback App | Frontend Mentor" }];
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
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="This is a solution to the Product feedback app challenge on Frontend Mentor."
        />
        <Meta />
        <Links />
      </head>
      <body>
        <div className="page">
          <Outlet />
        </div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
