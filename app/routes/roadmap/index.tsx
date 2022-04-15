import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import type { RoadmapContentProps as LoaderData } from "~/components/RoadmapContent";
import RoadmapContent from "~/components/RoadmapContent";
import RoadmapContentMobile, {
  links as RoadmapContentMobileLinks,
} from "~/components/RoadmapContentMobile";
import useWindowSize from "~/hooks/useWindowSize";
import { getRoadmapData } from "~/models/productRequest.server";
import roadmapStylesUrl from "~/styles/roadmap.css";

export const links: LinksFunction = () => {
  return [
    ...RoadmapContentMobileLinks(),
    { rel: "stylesheet", href: roadmapStylesUrl },
  ];
};

type RoadmapData = Awaited<ReturnType<typeof getRoadmapData>>;

function transformRoadmapData(productRequests: RoadmapData) {
  return productRequests.map((productRequest) => ({
    comments: productRequest._count.comments,
    ...productRequest,
  }));
}

export const loader: LoaderFunction = async () => {
  const liveStatus = await getRoadmapData("live");
  const plannedStatus = await getRoadmapData("planned");
  const inProgressStatus = await getRoadmapData("in-progress");

  return json<LoaderData>({
    liveStatusData: transformRoadmapData(liveStatus),
    plannedStatusData: transformRoadmapData(plannedStatus),
    inProgressStatusData: transformRoadmapData(inProgressStatus),
  });
};

function RoadmapIndex() {
  const windowSize = useWindowSize();
  const data = useLoaderData<LoaderData>();

  return (
    <>
      {windowSize.width <= 767 ? (
        <RoadmapContentMobile
          liveStatusData={data.liveStatusData}
          plannedStatusData={data.plannedStatusData}
          inProgressStatusData={data.inProgressStatusData}
        />
      ) : (
        <RoadmapContent
          liveStatusData={data.liveStatusData}
          plannedStatusData={data.plannedStatusData}
          inProgressStatusData={data.inProgressStatusData}
        />
      )}
    </>
  );
}

export default RoadmapIndex;
