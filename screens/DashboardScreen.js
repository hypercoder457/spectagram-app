import React from 'react';

import { NavigationContainer } from "@react-navigation/native";
import DrawerNavigator from "../navigation/DrawerNavigator";

import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

export default function DashBoardScreen() {
    return (
        <NavigationContainer>
            <DrawerNavigator />
        </NavigationContainer>
    )
}