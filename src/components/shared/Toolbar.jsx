import { Button, IconButton } from "components/shared";

export function Toolbar({ classes, children }) {
  return <div className={makeClassName("level", classes)}>{children}</div>;
}

function Left({ classes, children }) {
  return <div className={makeClassName("level-left", classes)}>{children}</div>;
}

function Right({ classes, children }) {
  return (
    <div className={makeClassName("level-right", classes)}>{children}</div>
  );
}

function Item({ classes, children }) {
  return <div className={makeClassName("level-item", classes)}>{children}</div>;
}

function ToolbarButton({ children, classes, icon, ...rest }) {
  return (
    <Toolbar.Item classes={classes}>
      {icon ? (
        <IconButton icon={icon} {...rest}>
          {children}
        </IconButton>
      ) : (
        <Button {...rest}>{children}</Button>
      )}
    </Toolbar.Item>
  );
}

const makeClassName = (base, other) => {
  return other ? `${base} ${other}` : base;
};

Toolbar.Left = Left;
Toolbar.Right = Right;
Toolbar.Item = Item;
Toolbar.Button = ToolbarButton;
