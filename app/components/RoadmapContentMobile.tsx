import * as RadixTabs from "@radix-ui/react-tabs";

import RoadmapCard from "~/components/RoadmapCard";
import type { RoadmapContentProps } from "~/components/RoadmapContent";
import RoadmapHeader from "~/components/RoadmapHeader";

function RoadmapContentMobile(props: RoadmapContentProps) {
  return (
    <>
      <RoadmapHeader />
      <main role="main">
        <RadixTabs.Root defaultValue="tab__planned">
          <RadixTabs.List className="tabs-list">
            <RadixTabs.Trigger
              className="tab tab__planned"
              value="tab__planned"
            >
              <p className="h3 tab-label">
                Planned ({props.plannedStatusData?.length})
              </p>
            </RadixTabs.Trigger>
            <RadixTabs.Trigger
              className="tab tab__in-progress"
              value="tab__in-progress"
            >
              <p className="h3 tab-label">
                In-Progress ({props.inProgressStatusData?.length})
              </p>
            </RadixTabs.Trigger>
            <RadixTabs.Trigger className="tab tab__live" value="tab__live">
              <p className="h3 tab-label">
                Live ({props.liveStatusData?.length})
              </p>
            </RadixTabs.Trigger>
          </RadixTabs.List>
          <RadixTabs.Content className="tab-panel" value="tab__planned">
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
          </RadixTabs.Content>
          <RadixTabs.Content className="tab-panel" value="tab__in-progress">
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
          </RadixTabs.Content>
          <RadixTabs.Content className="tab-panel" value="tab__live">
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
          </RadixTabs.Content>
        </RadixTabs.Root>
      </main>
    </>
  );
}

export default RoadmapContentMobile;
