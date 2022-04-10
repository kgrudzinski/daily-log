import { useState } from "react";
import { useCategories, useCategoryMutations } from "../hooks";
import { List, Card, Tabs, Page, Pages } from "../components/shared";

import { Projects } from "./Projects";

const TabNames = {
  CATEGORIES: "categories",
  PROJECTS: "projects",
};

export function Configuration() {
  const [activeTab, setActiveTab] = useState(TabNames.CATEGORIES);

  /*
  return (
    <div className="columns">
      <div className="column">
        <CategoryList></CategoryList>
      </div>
      <div className="column"></div>
    </div>
  );
  */
  return (
    <div className="m-2">
      <Tabs selected={activeTab} onChange={setActiveTab}>
        <Tabs.Tab id={TabNames.CATEGORIES}>Categories</Tabs.Tab>
        <Tabs.Tab id={TabNames.PROJECTS}>Projects</Tabs.Tab>
      </Tabs>
      <Pages selected={activeTab}>
        <Page value={TabNames.CATEGORIES}>
          <CategoryList></CategoryList>
        </Page>
        <Page value={TabNames.PROJECTS}>
          <Projects />
        </Page>
      </Pages>
    </div>
  );
}

function CategoryList() {
  const { data: categories, isLoading, isError, error } = useCategories();
  const operations = useCategoryMutations(
    () => {},
    (err) => {
      console.log(err.message);
    }
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>{error.message}</div>;
  }

  return (
    <Card expand={false}>
      <Card.Header>
        <Card.Title title="Categories"></Card.Title>
        <Card.Icon></Card.Icon>
      </Card.Header>
      <Card.Content>
        <List operations={operations}>
          {categories.map((it) => {
            return <List.Item key={it.id} value={it.name} id={it.id} />;
          })}
          <List.NewItem />
        </List>
      </Card.Content>
      <Card.Footer>
        <Card.FooterItem>Footer Item</Card.FooterItem>
      </Card.Footer>
    </Card>
  );

  /*
  return (
    <div className="box mt-1">
      <h1 class="title is-4 mb-2">Categories</h1>
      <List data={categories} operations={operations}></List>
    </div>
  );
  */
}
