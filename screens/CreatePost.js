import React from "react";
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    Platform,
    StatusBar,
    Image,
    ScrollView,
    TextInput,
    Button,
    Alert
} from "react-native";

import { RFValue } from "react-native-responsive-fontsize";
import DropDownPicker from "react-native-dropdown-picker";

import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

export default class CreatePost extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            previewImage: "image_1",
            dropdownHeight: 40,
            lightTheme: true,
            caption: null
        };
    }

    componentDidMount() {
        this.getUserTheme();
    }

    getUserTheme() {
        let theme;
        const themePath = `/users/${firebase.auth().currentUser.uid}/current_theme`;
        const userThemeRef = firebase.database().ref(themePath);
        userThemeRef.on('value', (data) => {
            theme = data.val();
            this.setState({ lightTheme: theme === "light" });
        })
    }

    async addPost() {
        const postData = {
            preview_image: this.state.previewImage,
            caption: this.state.caption,
            author: firebase.auth().currentUser.displayName,
            created_on: new Date(),
            author_uid: firebase.auth().currentUser.uid,
            likes: 0,
        }
        if (this.state.caption) {
            const randomUid = Math
                .random()
                .toString(36)
                .slice(2);
            await firebase
                .database()
                .ref(`/posts/${randomUid}`)
                .set(postData)
            this.props.navigation.navigate('Feed');
        } else {
            if (Platform.OS === 'ios' || Platform.OS === 'android') {
                Alert.alert(
                    'Error',
                    'All fields are required!',
                    [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
                    { cancelable: false }
                );
            } else {
                alert('Error! All fields are required!');
            }
        }
    }

    render() {
        let preview_images = {
            image_1: require("../assets/image_1.jpg"),
            image_2: require("../assets/image_2.jpg"),
            image_3: require("../assets/image_3.jpg"),
            image_4: require("../assets/image_4.jpg"),
            image_5: require("../assets/image_5.jpg"),
            image_6: require("../assets/image_6.jpg"),
            image_7: require("../assets/image_7.jpg")
        };

        let dropDownItems = [
            { label: "Image 1", value: "image_1" },
            { label: "Image 2", value: "image_2" },
            { label: "Image 3", value: "image_3" },
            { label: "Image 4", value: "image_4" },
            { label: "Image 5", value: "image_5" },
            { label: "Image 6", value: "image_6" },
            { label: "Image 7", value: "image_7" }
        ]

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
                        }>New Post</Text>
                    </View>
                </View>
                <View style={styles.fieldsContainer}>
                    <ScrollView>
                        <Image
                            source={preview_images[this.state.previewImage]}
                            style={styles.previewImage}
                        ></Image>
                        <View style={{ height: RFValue(this.state.dropdownHeight) }}>
                            <DropDownPicker
                                items={dropDownItems}
                                defaultValue={this.state.previewImage}
                                containerStyle={styles.dropDownContainer}
                                onOpen={() => {
                                    this.setState({ dropdownHeight: 170 });
                                }}
                                onClose={() => {
                                    this.setState({ dropdownHeight: 40 });
                                }}
                                style={{ backgroundColor: "transparent" }}
                                itemStyle={{
                                    justifyContent: "flex-start"
                                }}
                                dropDownStyle={{ backgroundColor: this.state.lightTheme ? "white" : "black" }}
                                labelStyle={{
                                    color: this.state.lightTheme ? "black" : "white"
                                }}
                                arrowStyle={{
                                    color: this.state.lightTheme ? "black" : "white"
                                }}
                                onChangeItem={item =>
                                    this.setState({
                                        previewImage: item.value
                                    })
                                }
                            />
                        </View>

                        <TextInput
                            style={[
                                styles.inputFont,
                                { marginTop: 20 }
                            ]}
                            onChangeText={caption => this.setState({ caption: caption })}
                            placeholder="Caption"
                            placeholderTextColor={this.state.lightTheme ? "black" : "white"}
                        />

                        <View style={styles.submitButton}>
                            <Button
                                title="Submit"
                                color="orange"
                                onPress={() => this.addPost()}
                            />
                        </View>
                    </ScrollView>
                </View>
                <View style={{ flex: 0.08 }} />
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
    dropDownContainer: {
        height: 40,
        borderRadius: 20,
        marginBottom: 10
    },
    droidSafeArea: {
        marginTop: Platform.OS === "android" ? StatusBar.currentHeight : RFValue(35)
    },
    appTitle: {
        flex: 0.07,
        flexDirection: "row"
    },
    appIcon: {
        flex: 0.3,
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
        flex: 0.7,
        justifyContent: "center"
    },
    appTitleText: {
        color: "white",
        fontSize: RFValue(28)
    },
    appTitleTextLight: {
        color: "black",
        fontSize: RFValue(28)
    },
    fieldsContainer: {
        flex: 0.85
    },
    previewImage: {
        width: "93%",
        height: RFValue(250),
        alignSelf: "center",
        borderRadius: RFValue(10),
        marginVertical: RFValue(10),
        resizeMode: "contain"
    },
    inputFont: {
        height: RFValue(40),
        borderColor: "white",
        borderWidth: RFValue(1),
        borderRadius: RFValue(10),
        paddingLeft: RFValue(10),
        color: "white"
    },
    submitButton: {
        marginTop: RFValue(20),
        alignItems: "center",
        justifyContent: "center"
    }
});
