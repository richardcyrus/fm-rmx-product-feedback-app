import type { LinksFunction } from "remix";

import { Tabs, TabList, Tab, TabPanels, TabPanel } from "@reach/tabs";

import RoadmapCard from "~/components/RoadmapCard";
import RoadmapHeader from "~/components/RoadmapHeader";

import tabsStyles from "@reach/tabs/styles.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: tabsStyles }];
};

export default function RoadmapContentMobile() {
  return (
    <>
      <RoadmapHeader />
      <Tabs>
        <TabList>
          <Tab className="tab__planned">
            <h3 className="h3 tab-label">Planned (2)</h3>
          </Tab>
          <Tab className="tab__in-progress">
            <h3 className="h3 tab-label">In-Progress (3)</h3>
          </Tab>
          <Tab className="tab__live">
            <h3 className="h3 tab-label">Live (1)</h3>
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <div className="column">
              <h3 className="h3 column-heading">Planned (2)</h3>
              <p className="body1 column-description">
                Ideas prioritized for research
              </p>
              <RoadmapCard />
            </div>
          </TabPanel>
          <TabPanel>
            <div className="column">
              <h3 className="h3 column-heading">In-Progress (3)</h3>
              <p className="body1 column-description">
                Currently being developed
              </p>
              <RoadmapCard />
            </div>
          </TabPanel>
          <TabPanel>
            <div className="column">
              <h3 className="h3 column-heading">Live (a)</h3>
              <p className="body1 column-description">Released features</p>
              <RoadmapCard />
            </div>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
}
