import React from "react";
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    Platform,
    StatusBar,
    Image,
    FlatList,
    Alert
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import PostCard from "./PostCard";

import firebase from "firebase";

export default class Feed extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            lightTheme: true,
            posts: []
        }
    }

    getUserTheme = () => {
        let theme;
        firebase
            .database()
            .ref(`/users/${firebase.auth().currentUser.uid}/current_theme`)
            .on("value", data => {
                theme = data.val();
                this.setState({ lightTheme: theme === "light" });
            });
    };

    fetchPosts = () => {
        var postsRef = firebase.database().ref(`/posts/`);
        postsRef.on('value', (data) => {
            let posts = [];
            if (data.val()) {
                Object.keys(data.val()).forEach(function (key) {
                    posts.push({ key: key, value: data.val()[key] });
                });
                this.setState({ posts: posts });
            } else {
                if (Platform.OS === 'android' ||
                    Platform.OS === 'ios') {
                    Alert.alert(
                        'Error',
                        'Loading the posts failed. Please try again...',
                        [{ text: 'OK' }]
                    );
                } else {
                    alert('Loading the posts failed. Please try again...');
                }
            }
        });
    };

    componentDidMount() {
        this.getUserTheme();
        this.fetchPosts();
    }

    renderItem = ({ item: post }) => {
        return <PostCard post={post} navigation={this.props.navigation} />;
    };

    keyExtractor = (item, index) => index.toString();

    render() {
        return (
            <View style={
                this.state.lightTheme ? styles.containerLight : styles.container
            }>
                <SafeAreaView style={styles.droidSafeArea} />
                <View style={styles.appTitle}>
                    <View style={styles.appIcon}>
                        <Image
                            source={require("../assets/logo.png")}
                            style={styles.iconImage}
                        ></Image>
                    </View>
                    <View style={styles.appTitleTextContainer}>
                        <Text style={
                            this.state.lightTheme ? styles.appTitleTextLight : styles.appTitleText
                        }
                        >
                            Spectagram
                        </Text>
                    </View>
                </View>
                <View style={styles.cardContainer}>
                    <FlatList
                        keyExtractor={this.keyExtractor}
                        data={this.state.posts}
                        renderItem={this.renderItem}
                    />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "black"
    },
    containerLight: {
        flex: 1,
        backgroundColor: "white"
    },
    droidSafeArea: {
        marginTop: Platform.OS === "android" ? StatusBar.currentHeight : RFValue(35)
    },
    appTitle: {
        flex: 0.07,
        flexDirection: "row"
    },
    appIcon: {
        flex: 0.2,
        justifyContent: "center",
        alignItems: "center"
    },
    iconImage: {
        width: "100%",
        height: "100%",
        resizeMode: "contain",
        backgroundColor: "black"
    },
    appTitleTextContainer: {
        flex: 0.8,
        justifyContent: "center"
    },
    appTitleText: {
        color: "white",
        fontSize: RFValue(28),
    },
    appTitleTextLight: {
        color: "black",
        fontSize: RFValue(28)
    },
    cardContainer: {
        flex: 0.85
    }
});
