import { Tabs, TabList, Tab, TabPanels, TabPanel } from "@reach/tabs";
import tabsStyles from "@reach/tabs/styles.css";
import type { LinksFunction } from "remix";

import RoadmapCard from "~/components/RoadmapCard";
import { RoadmapContentProps } from "~/components/RoadmapContent";
import RoadmapHeader from "~/components/RoadmapHeader";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: tabsStyles }];
};

export default function RoadmapContentMobile(props: RoadmapContentProps) {
  return (
    <>
      <RoadmapHeader />
      <main role="main">
        <Tabs>
          <TabList>
            <Tab className="tab__planned">
              <p className="h3 tab-label">
                Planned ({props.plannedStatusData?.length})
              </p>
            </Tab>
            <Tab className="tab__in-progress">
              <p className="h3 tab-label">
                In-Progress ({props.inProgressStatusData?.length})
              </p>
            </Tab>
            <Tab className="tab__live">
              <p className="h3 tab-label">
                Live ({props.liveStatusData?.length})
              </p>
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
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
            </TabPanel>
            <TabPanel>
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
            </TabPanel>
            <TabPanel>
              <div className="column">
                {props.liveStatusData.length > 0 && (
                  <>
                    <h2 className="h3 column-heading">
                      Live ({props.liveStatusData.length})
                    </h2>
                    <p className="body1 column-description">
                      Released features
                    </p>
                    {props.liveStatusData.map((item) => (
                      <RoadmapCard key={item.id} {...item} />
                    ))}
                  </>
                )}
              </div>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </main>
    </>
  );
}
