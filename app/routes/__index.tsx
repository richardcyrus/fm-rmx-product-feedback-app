import { useLoaderData, Outlet, Link } from "remix";
import type { LinksFunction, LoaderFunction } from "remix";

import suggestionsStylesUrl from "~/styles/suggestions.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: suggestionsStylesUrl }];
};

export let loader: LoaderFunction = async () => {
  let categories = [
    { key: "all", label: "All" },
    { key: "ui", label: "UI" },
    { key: "ux", label: "UX" },
    { key: "enhancement", label: "Enhancement" },
    { key: "bug", label: "Bug" },
    { key: "feature", label: "Feature" },
  ];

  let roadmapSummary = [
    { status: "Planned", count: 2 },
    { status: "In-Progress", count: 3 },
    { status: "Live", count: 1 },
  ];

  return { categories, roadmapSummary };
};

export default function FeedbackLayout() {
  let data = useLoaderData();

  return (
    <>
      <div className="header__panel">
        <header className="site-header">
          <div className="wrapper-site__title">
            <Link to="/">
              <h1 className="h2 site__title">Frontend Mentor</h1>
              <p className="body2 site__subtitle">Feedback Board</p>
            </Link>
          </div>
          <div className="mobile-menu">
            <button
              className="mobile-sidebar__trigger"
              type="button"
              aria-label="Toggle sidebar"
              aria-controls="sidebar"
            >
              <span className="mobile-sidebar__trigger-icon" />
            </button>
          </div>
        </header>
        <div className="mobile-sidebar__panel">
          <aside id="sidebar" className="sidebar">
            <section className="category-filter">
              <h2 className="sr-only">Category Filters</h2>
              {data.categories.map((category) => (
                <Link
                  to={category.key}
                  className="button pill"
                  type="button"
                  key={category.key}
                  data-category={category.key}
                >
                  {category.label}
                </Link>
              ))}
            </section>
            <section className="roadmap-summary">
              <div className="roadmap-summary__title">
                <h2 className="h3">Roadmap</h2>
                <Link to="/roadmap" className="body3 roadmap-view__link">
                  View
                </Link>
              </div>
              <div className="roadmap-summary__list">
                {data.roadmapSummary.map((summary) => (
                  <div
                    className="roadmap-summary__list-item"
                    key={summary.status}
                  >
                    <div
                      className={`bullet bullet__${summary.status.toLocaleLowerCase()}`}
                    />
                    <p className="roadmap-summary__category">
                      <span className="body1">{summary.status}</span>
                      <span className="roadmap-summary__category-count">
                        {summary.count}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </div>
      <main id="main-content" className="main-content">
        <Outlet />
      </main>
    </>
  );
}
