import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";

/**
 * Redirect to the "/feedback/all" categories route as the default.
 *
 * Index routes do not render outlets, and an index route is required
 * to trigger the display of the layout content.
 */
export const loader: LoaderFunction = async () => redirect("/feedback/all");
