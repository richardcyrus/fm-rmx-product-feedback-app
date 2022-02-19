import type { LinksFunction } from "remix";

import RoadmapContent from "~/components/RoadmapContent";
import RoadmapContentMobile, {
  links as RoadmapContentMobileLinks,
} from "~/components/RoadmapContentMobile";

import useWindowSize from "~/utils/useWindowSize";

import roadmapStylesUrl from "~/styles/roadmap.css";

export const links: LinksFunction = () => {
  return [
    ...RoadmapContentMobileLinks(),
    { rel: "stylesheet", href: roadmapStylesUrl },
  ];
};

export default function RoadmapIndex() {
  const windowSize = useWindowSize();

  return (
    <>
      {windowSize.width <= 767 ? <RoadmapContentMobile /> : <RoadmapContent />}
    </>
  );
}
