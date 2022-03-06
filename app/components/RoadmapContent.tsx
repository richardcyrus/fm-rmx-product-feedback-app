import RoadmapCard, { FeedbackData } from "~/components/RoadmapCard";
import RoadmapHeader from "~/components/RoadmapHeader";

export interface RoadmapContentProps {
  liveStatusData: FeedbackData[];
  plannedStatusData: FeedbackData[];
  inProgressStatusData: FeedbackData[];
}

export default function RoadmapContent(props: RoadmapContentProps) {
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
                <RoadmapCard key={item.id} {...item} />
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
                <RoadmapCard key={item.id} {...item} />
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
                <RoadmapCard key={item.id} {...item} />
              ))}
            </>
          )}
        </div>
      </main>
    </>
  );
}
