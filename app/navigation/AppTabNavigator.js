import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator, createDrawerNavigator } from 'react-navigation';
import { DrawerItems } from 'react-navigation-drawer';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import AddScreen from '../screens/AddScreen';
import GuessScreen from '../screens/GuessScreen';
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
          ? 'ios-home'
          : 'md-home'
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
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-stats' : 'md-stats'} />
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
  tabBarLabel: 'Objects',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-cube' : 'md-cube'} />
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
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-camera' : 'md-camera'} />
  ),
};

AddStack.path = '';

const GuessStack = createStackNavigator(
  {
    screen: GuessScreen,
  },
  config
);

GuessStack.navigationOptions = {
  tabBarLabel: 'Guess',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-cube' : 'md-cube'} />
  ),
};

GuessStack.path = '';

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
    <TabBarIcon focused={focused} name={(Platform.OS === 'ios' ? 'ios-star' : 'md-star') + (focused ? '' :'-outline')} />
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
  GuessStack,
  GameStack,
  WishListStack,
});

ChildTabNavigator.path = '';

export default {ParentTabNavigator, ChildTabNavigator};
