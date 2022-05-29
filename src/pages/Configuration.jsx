import { useState } from "react";
import { useCategories, useCategoryMutations } from "hooks";
import { List, Tabs, Page, Pages, useToast } from "components/shared";

import { Projects } from "./Projects";

const TabNames = {
  CATEGORIES: "categories",
  PROJECTS: "projects",
};

export function Configuration() {
  const [activeTab, setActiveTab] = useState(TabNames.CATEGORIES);

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
  const { error: errorToast, success } = useToast();
  const { add, remove, update } = useCategoryMutations(
    () => {
      success("Success");
    },
    (err) => {
      errorToast(err);
      console.log(err.message);
    }
  );

  const operations = {
    add: function (value) {
      add({ id: 0, name: value });
    },
    remove: remove,
    update: function (id, value) {
      update({ id, name: value });
    },
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>{error.message}</div>;
  }

  return (
    <List operations={operations}>
      {categories.map((it) => {
        return <List.Item key={it.id} value={it.name} id={it.id} />;
      })}
      <List.NewItem />
    </List>
  );
}
