import { Outlet } from "remix";

export default function Index() {
  return (
    <div>
      <h1>pathless route index</h1>
      <Outlet />
    </div>
  );
}
