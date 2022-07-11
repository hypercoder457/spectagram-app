import React, { useState, useEffect } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';

import StackNavigator from './StackNavigator';
import Profile from '../screens/Profile';
import Logout from "../screens/Logout";
import CustomSideBarMenu from "../screens/CustomSideBarMenu";

import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  const [lightTheme, setLightTheme] = useState(true);

  useEffect(() => {
    let theme;
    const userThemeRef = firebase
      .database()
      .ref(`/users/${firebase.auth().currentUser.uid}/current_theme`)
    userThemeRef.on('value', data => {
      theme = data.val();
      setLightTheme(theme === "light" ? true : false);
    })
  }, [])

  return (
    <Drawer.Navigator
      screenOptions={{
        activeTintColor: "blue",
        inactiveTintColor: lightTheme ? "black" : "white",
        itemStyle: { marginVertical: 5 }
      }}
      drawerContent={props => <CustomSideBarMenu {...props} />}
    >
      <Drawer.Screen name="Home" component={StackNavigator} options={{ unmountOnBlur: true }} />
      <Drawer.Screen name="Profile" component={Profile} options={{ unmountOnBlur: true }} />
      <Drawer.Screen name="Logout" component={Logout} options={{ unmountOnBlur: true }} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
