import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import AddScreen from '../screens/AddScreen';
import StatsScreen from '../screens/StatsScreen';
import GameScreen from '../screens/GameScreen';
import ObjectsScreen from '../screens/ObjectsScreen';
import ChildScreen from '../screens/ChildScreen';
import MainWishListScreen from '../screens/wishlist/MainScreen';

const config = Platform.select({
  web: { headerMode: 'screen' },
  default: {},
});

const HomeStack = createStackNavigator(
  {
    Home: HomeScreen,
  },
  config
);

HomeStack.navigationOptions = {
  tabBarLabel: 'Home',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-information-circle${focused ? '' : '-outline'}`
          : 'md-information-circle'
      }
    />
  ),
};

HomeStack.path = '';

const ChildStack = createStackNavigator(
  {
    screen: ChildScreen,
  },
  config
);

ChildStack.navigationOptions = {
  tabBarLabel: 'Child',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-link' : 'md-link'} />
  ),
};

ChildStack.path = '';

const ObjectsStack = createStackNavigator(
  {
    screen: ObjectsScreen,
  },
  config
);

ObjectsStack.navigationOptions = {
  tabBarLabel: 'Add',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-link' : 'md-link'} />
  ),
};

ObjectsStack.path = '';

const AddStack = createStackNavigator(
  {
    Add: AddScreen,
  },
  config
);

AddStack.navigationOptions = {
  tabBarLabel: 'Add',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-link' : 'md-link'} />
  ),
};

AddStack.path = '';

const StatsStack = createStackNavigator(
  {
    Stats: StatsScreen,
  },
  config
);

StatsStack.navigationOptions = {
  tabBarLabel: 'Stats',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-options' : 'md-options'} />
  ),
};

StatsStack.path = '';

const GameStack = createStackNavigator(
  {
    Stats: GameScreen,
  },
  config
);

GameStack.navigationOptions = {
  tabBarLabel: 'Game',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-basketball' : 'md-basketball'} />
  ),
};

GameStack.path = '';

const WishListStack = createStackNavigator(
  {
    Stats: MainWishListScreen,
  },
  config
);

WishListStack.navigationOptions = {
  tabBarLabel: 'Wish List',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-basketball' : 'md-basketball'} />
  ),
};

const ParentTabNavigator = createBottomTabNavigator({
  HomeStack,
  ChildStack,
  AddStack,
  ObjectsStack
});

ParentTabNavigator.path = '';

const ChildTabNavigator = createBottomTabNavigator({
  HomeStack,
  GameStack,
  WishListStack,
});

ChildTabNavigator.path = '';

export default {ParentTabNavigator, ChildTabNavigator};
