import type { LinksFunction, LoaderFunction } from "remix";
import { useLoaderData } from "remix";

import RoadmapContent, {
  RoadmapContentProps,
} from "~/components/RoadmapContent";
import RoadmapContentMobile, {
  links as RoadmapContentMobileLinks,
} from "~/components/RoadmapContentMobile";

import useWindowSize from "~/utils/useWindowSize";
import { db } from "~/utils/db.server";

import roadmapStylesUrl from "~/styles/roadmap.css";

export const links: LinksFunction = () => {
  return [
    ...RoadmapContentMobileLinks(),
    { rel: "stylesheet", href: roadmapStylesUrl },
  ];
};

interface FeedbackDataQueryResult {
  id: number;
  title: string;
  category: string;
  upvotes: number;
  status: string;
  description: string;
  _count: Record<string, number>;
}

function transformResults(data: FeedbackDataQueryResult[]) {
  return data.map((item: FeedbackDataQueryResult) => {
    return {
      comments: item._count.comments,
      ...item,
    };
  });
}

async function getRoadmapData(filter: string) {
  return db.productRequest.findMany({
    where: { status: filter },
    orderBy: { upvotes: "desc" },
    include: {
      _count: {
        select: { comments: true },
      },
    },
  });
}

export const loader: LoaderFunction = async () => {
  const liveStatusQResult = await getRoadmapData("live");
  const plannedStatusQResult = await getRoadmapData("planned");
  const inProgressStatusQResult = await getRoadmapData("in-progress");

  return {
    liveStatusData: transformResults(liveStatusQResult),
    plannedStatusData: transformResults(plannedStatusQResult),
    inProgressStatusData: transformResults(inProgressStatusQResult),
  };
};

export default function RoadmapIndex() {
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
