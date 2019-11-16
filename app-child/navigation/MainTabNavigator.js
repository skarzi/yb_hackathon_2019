import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import BuyScreen from '../screens/BuyScreen';
import StatsScreen from '../screens/StatsScreen';
import GameScreen from '../screens/GameScreen';
import MainWishListScreen from '../screens/wishlist/MainScreen';

const config = Platform.select({
  web: { headerMode: 'screen' },
  default: {},
});


const BuyStacks = createStackNavigator(
  {
    Home: BuyScreen,
  },
  config
);

BuyStacks.navigationOptions = {
  tabBarLabel: 'Add',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-link' : 'md-link'} />
  ),
};

BuyStacks.path = '';


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
    WishList: MainWishListScreen,
  },
  config
);

WishListStack.navigationOptions = {
  tabBarLabel: 'Wish List',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-basketball' : 'md-basketball'} />
  ),
};

const tabNavigator = createBottomTabNavigator({
  BuyStacks,
  GameStack,
  WishListStack,
});

tabNavigator.path = '';

export default tabNavigator;
