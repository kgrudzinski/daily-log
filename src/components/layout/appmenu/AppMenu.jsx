//import { mdiInformationVariant } from "@mdi/js";
import { Menu, MenuHeader, MenuItems, MenuItem, MenuFooter } from "components";
import {
  Icon,
  IconText,
  IconButton,
  ButtonColor,
  ButtonSize,
} from "components/shared";
import { Icons } from "consts";

export function AppMenu({ menu, selected, dispatch }) {
  const onChange = (value) => {
    dispatch({ type: "change", value: value });
  };

  const onButtonClick = (name) => {
    dispatch({ type: "action", name: name });
  };

  return (
    <Menu selected={selected} onChange={onChange}>
      <MenuHeader>Daily log</MenuHeader>
      <MenuItems>
        {menu.map((it) => {
          return (
            <AppMenuItem
              key={it.id}
              id={it.id}
              label={it.label}
              icon={it.icon}
            />
          );
        })}
      </MenuItems>

      <MenuFooter>
        <AppMenuButton
          icon={Icons.INFO}
          text="About"
          onClick={() => onButtonClick("about")}
        />
      </MenuFooter>
    </Menu>
  );
}

function AppMenuItem({ id, label, icon }) {
  return (
    <MenuItem
      value={id}
      label={
        <IconText>
          <Icon icon={icon} />
          <Icon.Text>{label}</Icon.Text>
        </IconText>
      }
    />
  );
}

function AppMenuButton({ icon, text, onClick }) {
  return (
    <IconButton
      icon={icon}
      color={ButtonColor.LINK}
      onClick={onClick}
      size={ButtonSize.SMALL}
    >
      {text}
    </IconButton>
  );
}
