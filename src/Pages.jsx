import React from 'react';

export function Pages({selected, children}) {

    const page = React.Children.toArray(children).find(it => it.props.value === selected);

   return page;
}

export function Page({children}) {    
   return <>{children}</>
}