import React, { useState, useEffect } from "react";
import { SafeAreaView, View, StyleSheet, Image, Platform, StatusBar } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import firebase from "firebase";

import {
    DrawerContentScrollView,
    DrawerItemList
} from "@react-navigation/drawer";

export default function CustomSideBarMenu(props) {
    const [lightTheme, setLightTheme] = useState(true);

    useEffect(() => {
        let theme;
        firebase
            .database()
            .ref(`/users/${firebase.auth().currentUser.uid}/current_theme`)
            .on("value", data => {
                theme = data.val();
                setLightTheme(theme === "light");
            });
    }, []);

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: lightTheme ? "white" : "#15193c"
            }}
        >
            <SafeAreaView style={styles.droidSafeArea} />
            <Image
                source={require("../assets/logo.png")}
                style={styles.sideMenuProfileIcon}
            ></Image>
            <DrawerContentScrollView {...props}>
                <DrawerItemList {...props} />
            </DrawerContentScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    sideMenuProfileIcon: {
        width: RFValue(140),
        height: RFValue(140),
        borderRadius: RFValue(70),
        alignSelf: "center",
        marginTop: RFValue(60),
        resizeMode: "contain"
    },
    droidSafeArea: {
        marginTop: Platform.OS === "android" ? StatusBar.currentHeight : RFValue(35)
    }
});