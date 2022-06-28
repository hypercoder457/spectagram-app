import React from 'react';
import {
    Text,
    View,
    Image,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import firebase from 'firebase';
import { RFValue } from 'react-native-responsive-fontsize';

export default class Profile extends React.Component {
    constructor() {
        super();
        this.state = {
            lightTheme: true,
            user: firebase.auth().currentUser
        }
    }

    componentDidMount() {
        this.getUserTheme();
    }

    toggleTheme = () => {
        const uid = this.state.user.uid;
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
        const uid = this.state.user.uid;
        const userThemeRef = firebase.database().ref(`/users/${uid}/current_theme`);
        userThemeRef.on("value", data => {
            let theme = data.val();
            this.setState({
                lightTheme: theme === "light"
            })
        })
    }

    render() {
        return (
            <View style={
                this.state.lightTheme ? styles.profileContainerLight : styles.profileContainer
            }
            >
                <Image
                    source={{ uri: this.state.user.photoURL }}
                    style={styles.userPhoto}
                >
                </Image>
                <Text style={
                    this.state.lightTheme ? styles.userInfoLight : styles.userInfo
                }
                >
                    {this.state.user.displayName}
                </Text>

                <Text style={
                    this.state.lightTheme ? styles.userInfoLight : styles.userInfo
                }
                >
                    Email: {this.state.user.email}
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
        color: "white"
    },
    userInfoLight: {
        fontSize: 20
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
        color: "black"
    }
})
