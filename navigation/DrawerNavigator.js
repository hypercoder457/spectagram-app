import React from 'react';
import { View } from 'react-native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem
} from '@react-navigation/drawer';

import StackNavigator from './StackNavigator';
import Profile from '../screens/Profile';

import firebase from 'firebase';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator 
      drawerContent={props => <AppDrawerContent {...props} />}>
      <Drawer.Screen name="Home" component={StackNavigator} />
      <Drawer.Screen name="Profile" component={Profile} />
    </Drawer.Navigator>
  );
};

function AppDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}>
      {/*all of the drawer items*/}
      <DrawerItemList {...props} />
      <View>
        {/* here's where you put your logout drawer item*/}
        <DrawerItem
          label="Log out"
          onPress={() => firebase.auth().signOut()}
        />
      </View>
    </DrawerContentScrollView>
  );
}

export default DrawerNavigator;
