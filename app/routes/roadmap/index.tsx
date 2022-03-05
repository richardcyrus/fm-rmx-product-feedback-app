import type { LinksFunction, LoaderFunction } from "remix";
import { useLoaderData } from "remix";

import RoadmapContent, {
  RoadmapContentProps,
} from "~/components/RoadmapContent";
import RoadmapContentMobile, {
  links as RoadmapContentMobileLinks,
} from "~/components/RoadmapContentMobile";
import { getRoadmapData } from "~/models/productRequest.server";
import roadmapStylesUrl from "~/styles/roadmap.css";
import useWindowSize from "~/utils/useWindowSize";

export const links: LinksFunction = () => {
  return [
    ...RoadmapContentMobileLinks(),
    { rel: "stylesheet", href: roadmapStylesUrl },
  ];
};

export const loader: LoaderFunction = async () => {
  return {
    liveStatusData: await getRoadmapData("live"),
    plannedStatusData: await getRoadmapData("planned"),
    inProgressStatusData: await getRoadmapData("in-progress"),
  };
};

function RoadmapIndex() {
  const windowSize = useWindowSize();
  const data = useLoaderData<RoadmapContentProps>();

  return (
    <>
      {windowSize.width <= 767 ? (
        <RoadmapContentMobile {...data} />
      ) : (
        <RoadmapContent {...data} />
      )}
    </>
  );
}

export default RoadmapIndex;
