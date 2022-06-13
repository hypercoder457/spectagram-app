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
            userTheme: null,
            user: firebase.auth().currentUser
        }
    }

    componentDidMount() {
        this.getUserTheme();
    }

    toggleTheme = () => {
        const usersRef = firebase.database().ref(`/users/${this.state.user.uid}/`);
        if (this.state.userTheme === "dark") {
            usersRef.set({
                current_theme: "light"
            })
        } else {
            usersRef.set({
                current_theme: "dark"
            })
        }
    }

    getUserTheme = () => {
        const uid = this.state.user.uid;
        const userThemeRef = firebase.database().ref(`/users/${uid}/current_theme`);
        userThemeRef.on("value", (data) => {
            this.setState({
                userTheme: data.val()
            })
        })
    }

    render() {
        return (
            <View style={
                this.state.userTheme === "dark" ? styles.profileContainer : styles.profileContainerLight
            }
            >
                <Image
                    source={this.state.user.photoURL}
                    style={styles.userPhoto}
                >
                </Image>
                <Text style={
                    this.state.userTheme === "dark" ? styles.userInfo : styles.userInfoLight
                }
                >
                    {this.state.user.displayName}
                </Text>

                <Text style={
                    this.state.userTheme === "dark" ? styles.userInfo : styles.userInfoLight
                }
                >
                    Email: {this.state.user.email}
                </Text>

                <Text style={
                    this.state.userTheme === "dark" ? styles.userInfo : styles.userInfoLight
                }
                >
                    Your current theme is set to: {this.state.userTheme}
                </Text>
                <TouchableOpacity
                    style={styles.themeToggleButton}
                    onPress={() => this.toggleTheme()}
                >
                    <Text style={
                        this.state.userTheme === "dark" ? null : styles.toggleTextLight
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
