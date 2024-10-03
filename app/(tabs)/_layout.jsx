import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image } from 'react-native';

import Home from './home';
import Wishlist from './wishlist';
import History from './history';
import Account from './account';

const Tab = createBottomTabNavigator();

export default function Layout() {
  return (
      <Tab.Navigator
        screenOptions={({ route }) => ({

          tabBarIcon: () => {
            let iconSource;

            if (route.name === 'Home') {
              iconSource = require('../../assets/Home.png');
            } else if (route.name === 'Wishlist') {
              iconSource = require('../../assets/Heart.png');
            } else if (route.name === 'History') {
              iconSource = require('../../assets/Paper.png');
            } else if (route.name === 'Account') {
              iconSource = require('../../assets/Profile.png');
            }

            return <Image source={iconSource} style={{ width: 24, height: 24 }} />;
          },
          tabBarActiveTintColor: '#67C4A7'
        })}
      >
        <Tab.Screen name="Home" component={Home} options={{headerShown:  false}} />
        <Tab.Screen name="Wishlist" component={Wishlist} />
        <Tab.Screen name="History" component={History} />
        <Tab.Screen name="Account" component={Account} />
      </Tab.Navigator>
  );
}