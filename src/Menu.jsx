import React from "react";
import {useState, useContext} from "react";
import "./css/main.scss";

const MenuContext = React.createContext();

const useMenu = () => {
    let context = useContext(MenuContext);
    return context;
}

export function Menu({selected, onChange, children}) {
    const [selectedItem, setSelectedItem] = useState(selected);

    const onSelectItem = (value) => {
        setSelectedItem(value);
        onChange(value);
    }

    return (
        <MenuContext.Provider value={{selectedItem: selectedItem, onSelectItem: onSelectItem}}>
            <div className="app-menu">
                {children}
            </div>
        </MenuContext.Provider>
    );
}

export function MenuHeader({children}) {
    return (<div className="app-menu-header">
        {children}
    </div>)
}

export function MenuFooter({children}) {
    return (<div className="app-menu-footer"><span>{children}</span></div>)
}

export function MenuItems({children}) {
    return (<ul className="app-menu-list">
        {children}
    </ul>)
}

export function MenuItem({value, label}) {
    const {selectedItem, onSelectItem} = useMenu();

    const item_class = value === selectedItem ? "selected" : "";

    return (<li className={item_class} onClick={() => onSelectItem(value)}>{label}</li>);
}