import React from "react";
import {
    Text,
    View,
    Image,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import { RFValue } from "react-native-responsive-fontsize";

import * as Font from "expo-font";
import AppLoading from "expo-app-loading";

const fontsToLoad = {
    "CedarvilleCursive": require("../assets/fonts/CedarvilleCursive-Regular.ttf")
};

export default class Profile extends React.Component {
    constructor() {
        super();
        this.state = {
            lightTheme: true,
            fontsLoaded: true
        }
    }

    componentDidMount() {
        this.getUserTheme();
        this.loadFonts();
    }

    async loadFonts() {
        await Font.loadAsync(fontsToLoad);
        this.setState({ fontsLoaded: true });
    }

    getUser = () => {
        return firebase.auth().currentUser;
    }

    toggleTheme = () => {
        const uid = this.getUser().uid;
        const usersRef = firebase.database().ref(`/users/${uid}/`);
        if (this.state.lightTheme) {
            usersRef.set({
                current_theme: "dark"
            })
        } else {
            usersRef.set({
                current_theme: "light"
            })
        }
    }

    getUserTheme = () => {
        const uid = this.getUser().uid;
        const userThemeRef = firebase.database().ref(`/users/${uid}/current_theme`);
        userThemeRef.on("value", data => {
            let theme = data.val();
            this.setState({
                lightTheme: theme === "light"
            })
        })
    }

    render() {
        if (!this.state.fontsLoaded) {
            return <AppLoading />;
        }
        return (
            <View style={
                this.state.lightTheme ? styles.profileContainerLight : styles.profileContainer
            }
            >
                <Image
                    source={{ uri: this.getUser().photoURL }}
                    style={styles.userPhoto}
                >
                </Image>
                <Text style={
                    this.state.lightTheme ? styles.userInfoLight : styles.userInfo
                }
                >
                    {this.getUser().displayName}
                </Text>

                <Text style={
                    this.state.lightTheme ? styles.userInfoLight : styles.userInfo
                }
                >
                    Email: {this.getUser().email}
                </Text>

                <Text style={
                    this.state.lightTheme ? styles.userInfoLight : styles.userInfo
                }
                >
                    Your current theme is set to: {this.state.lightTheme ? "light" : "dark"}
                </Text>
                <TouchableOpacity
                    style={styles.themeToggleButton}
                    onPress={() => this.toggleTheme()}
                >
                    <Text style={
                        this.state.lightTheme ? styles.toggleTextLight : null
                    }
                    >
                        Toggle theme
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    profileContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "black"
    },
    profileContainerLight: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white"
    },
    userPhoto: {
        resizeMode: "contain",
        width: "20%",
        height: "20%",
        marginBottom: RFValue(20)
    },
    userInfo: {
        fontSize: 20,
        color: "white",
        fontFamily: "CedarvilleCursive"
    },
    userInfoLight: {
        fontSize: 20,
        fontFamily: "CedarvilleCursive"
    },
    themeToggleButton: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
        borderRadius: RFValue(50),
        backgroundColor: "white",
        marginTop: RFValue(10),
        width: RFValue(100)
    },
    toggleTextLight: {
        color: "black",
        fontFamily: "CedarvilleCursive"
    }
})
