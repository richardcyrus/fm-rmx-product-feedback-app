import RoadmapCard from "~/components/RoadmapCard";
import RoadmapHeader from "~/components/RoadmapHeader";

export default function RoadmapContent() {
  return (
    <>
      <RoadmapHeader />
      <div className="container">
        <div className="column">
          <h3 className="h3 column-heading">Planned (2)</h3>
          <p className="body1 column-description">
            Ideas prioritized for research
          </p>
          <RoadmapCard />
        </div>
        <div className="column">
          <h3 className="h3 column-heading">In-Progress (3)</h3>
          <p className="body1 column-description">Currently being developed</p>
          <RoadmapCard />
        </div>
        <div className="column">
          <h3 className="h3 column-heading">Live (a)</h3>
          <p className="body1 column-description">Released features</p>
          <RoadmapCard />
        </div>
      </div>
    </>
  );
}
