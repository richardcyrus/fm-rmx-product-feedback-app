import { useState } from "react";

import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";

import { getRoadmapSummary } from "~/models/productRequest.server";
import layoutStylesUrl from "~/styles/feedback-layout.css";
import { toTitleCase } from "~/utils/stringUtils";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: layoutStylesUrl }];
};

type LoaderData = {
  categories: Array<{ key: string; label: string }>;
  roadmapSummary: Array<{ status: string; count: number }>;
};

export const loader: LoaderFunction = async () => {
  const roadmapSummaryResults = await getRoadmapSummary();

  const roadmapSummary = roadmapSummaryResults.map((entry) => ({
    status: entry.status,
    count: entry._count.status,
  }));

  const categories = [
    { key: "all", label: "All" },
    { key: "ui", label: "UI" },
    { key: "ux", label: "UX" },
    { key: "enhancement", label: "Enhancement" },
    { key: "bug", label: "Bug" },
    { key: "feature", label: "Feature" },
  ];

  return json<LoaderData>({ categories, roadmapSummary });
};

function FeedbackLayout() {
  const data = useLoaderData<LoaderData>();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="header__panel">
        <header className="site-header" role="banner">
          <div className="wrapper-site__title">
            <Link to="/">
              <p className="h2 site__title">Frontend Mentor</p>
              <h1 className="body2 site__subtitle">Feedback Board</h1>
            </Link>
          </div>
          <div
            className="mobile-menu"
            data-status={!isOpen ? "closed" : "open"}
          >
            <button
              className="mobile-sidebar__trigger"
              type="button"
              aria-label="Toggle sidebar"
              aria-controls="sidebar"
              aria-expanded={isOpen}
              onClick={() => setIsOpen(!isOpen)}
            >
              <span className="mobile-sidebar__trigger-icon" />
            </button>
          </div>
        </header>
        <div
          className={`${!isOpen ? "hidden" : "mobile-sidebar__panel"}`}
          data-element="mobile-sidebar__panel"
        >
          <aside id="sidebar" className="sidebar">
            <section className="category-filter">
              <h2 className="sr-only">Category Filters</h2>
              {data.categories.map((category) => (
                <NavLink
                  to={category.key}
                  onClick={() => setIsOpen(false)}
                  onBlur={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    isActive ? "button pill active" : "button pill"
                  }
                  key={category.key}
                  data-category={category.key}
                >
                  {category.label}
                </NavLink>
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
                      <span className="body1">
                        {toTitleCase(summary.status)}
                      </span>
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
      <main role="main" id="main-content" className="main-content">
        <Outlet />
      </main>
    </>
  );
}

export default FeedbackLayout;
