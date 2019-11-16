import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import Tabs from './AppTabNavigator';

export default createAppContainer(
  createSwitchNavigator({
    // You could add another route here for authentication.
    // Read more at https://reactnavigation.org/docs/en/auth-flow.html
    Parent: Tabs.ParentTabNavigator,
    Child: Tabs.ChildTabNavigator,
  },
  {
    initialRouteName: 'Parent'    
  })
);
