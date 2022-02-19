import type { LinksFunction } from "remix";

import { Tabs, TabList, Tab, TabPanels, TabPanel } from "@reach/tabs";

import RoadmapCard from "~/components/RoadmapCard";
import RoadmapHeader from "~/components/RoadmapHeader";
import { RoadmapContentProps } from "~/components/RoadmapContent";

import tabsStyles from "@reach/tabs/styles.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: tabsStyles }];
};

export default function RoadmapContentMobile(props: RoadmapContentProps) {
  return (
    <>
      <RoadmapHeader />
      <Tabs>
        <TabList>
          <Tab className="tab__planned">
            <h3 className="h3 tab-label">
              Planned ({props.plannedStatusData?.length})
            </h3>
          </Tab>
          <Tab className="tab__in-progress">
            <h3 className="h3 tab-label">
              In-Progress ({props.inProgressStatusData?.length})
            </h3>
          </Tab>
          <Tab className="tab__live">
            <h3 className="h3 tab-label">
              Live ({props.liveStatusData?.length})
            </h3>
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <div className="column">
              {props.plannedStatusData.length > 0 && (
                <>
                  <h3 className="h3 column-heading">
                    Planned ({props.plannedStatusData.length})
                  </h3>
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
                  <h3 className="h3 column-heading">
                    In-Progress ({props.inProgressStatusData.length})
                  </h3>
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
                  <h3 className="h3 column-heading">
                    Live ({props.liveStatusData.length})
                  </h3>
                  <p className="body1 column-description">Released features</p>
                  {props.liveStatusData.map((item) => (
                    <RoadmapCard key={item.id} {...item} />
                  ))}
                </>
              )}
            </div>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
}
