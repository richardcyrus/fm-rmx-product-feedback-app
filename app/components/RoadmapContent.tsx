import type { FeedbackData } from "~/components/RoadmapCard";
import RoadmapCard from "~/components/RoadmapCard";
import RoadmapHeader from "~/components/RoadmapHeader";

export interface RoadmapContentProps {
  liveStatusData: FeedbackData[];
  plannedStatusData: FeedbackData[];
  inProgressStatusData: FeedbackData[];
}

function RoadmapContent(props: RoadmapContentProps) {
  return (
    <>
      <RoadmapHeader />
      <main className="container" role="main">
        <div className="column">
          {props.plannedStatusData.length > 0 && (
            <>
              <h2 className="h3 column-heading">
                Planned ({props.plannedStatusData.length})
              </h2>
              <p className="body1 column-description">
                Ideas prioritized for research
              </p>
              {props.plannedStatusData.map((item) => (
                <RoadmapCard
                  id={item.id}
                  title={item.title}
                  category={item.category}
                  upvotes={item.upvotes}
                  status={item.status}
                  description={item.description}
                  comments={item.comments}
                  key={item.id}
                />
              ))}
            </>
          )}
        </div>
        <div className="column">
          {props.inProgressStatusData.length > 0 && (
            <>
              <h2 className="h3 column-heading">
                In-Progress ({props.inProgressStatusData.length})
              </h2>
              <p className="body1 column-description">
                Currently being developed
              </p>
              {props.inProgressStatusData.map((item) => (
                <RoadmapCard
                  id={item.id}
                  title={item.title}
                  category={item.category}
                  upvotes={item.upvotes}
                  status={item.status}
                  description={item.description}
                  comments={item.comments}
                  key={item.id}
                />
              ))}
            </>
          )}
        </div>
        <div className="column">
          {props.liveStatusData.length > 0 && (
            <>
              <h2 className="h3 column-heading">
                Live ({props.liveStatusData.length})
              </h2>
              <p className="body1 column-description">Released features</p>
              {props.liveStatusData.map((item) => (
                <RoadmapCard
                  id={item.id}
                  title={item.title}
                  category={item.category}
                  upvotes={item.upvotes}
                  status={item.status}
                  description={item.description}
                  comments={item.comments}
                  key={item.id}
                />
              ))}
            </>
          )}
        </div>
      </main>
    </>
  );
}

export default RoadmapContent;
