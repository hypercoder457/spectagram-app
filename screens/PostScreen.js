import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Platform,
  StatusBar,
  SafeAreaView,
  TouchableOpacity
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { RFValue } from "react-native-responsive-fontsize";
import * as Speech from "expo-speech";
import * as Font from "expo-font";
import AppLoading from "expo-app-loading";

import firebase from "firebase/app";
import "firebase/database";

const fontsToLoad = {
  "CedarvilleCursive": require("../assets/fonts/CedarvilleCursive-Regular.ttf")
};

export default class PostScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      speakerColor: "white",
      speakerIcon: "volume-high-outline",
      lightTheme: true,
      fontsLoaded: false
    }
  }

  async loadFonts() {
    await Font.loadAsync(fontsToLoad);
    this.setState({ fontsLoaded: true });
  }

  componentDidMount() {
    this.getUserTheme();
    this.loadFonts();
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

  textToSpeech(author, caption) {
    const currentColor = this.state.speakerColor;
    this.setState({
      speakerColor: currentColor === "white" ? "#ee8249" : "white"
    });
    if (currentColor === "white") {
      Speech.speak(`Post created by: ${author}`)
      Speech.speak(`Caption: ${caption}`)
    } else {
      Speech.stop();
    }
  }

  render() {
    const post = this.props.route.params.post['value'];
    let preview_images = {
      image_1: require("../assets/image_1.jpg"),
      image_2: require("../assets/image_2.jpg"),
      image_3: require("../assets/image_3.jpg"),
      image_4: require("../assets/image_4.jpg"),
      image_5: require("../assets/image_5.jpg"),
      image_6: require("../assets/image_6.jpg"),
      image_7: require("../assets/image_7.jpg")
    };
    if (!this.state.fontsLoaded) {
      return <AppLoading />;
    } else if (!this.props.route.params) {
      this.props.navigation.navigate("Home")
    } else {
      return (
        <View style={
          this.state.lightTheme ? styles.containerLight : styles.container
        }
        >
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
          <Image source={preview_images[post.preview_image]} style={styles.postImage} />
          <Text style={
            this.state.lightTheme ? styles.captionTextLight : styles.captionText
          }
          >
            {post.caption}
          </Text>
          <Text style={
            this.state.lightTheme ? styles.authorNameTextLight : styles.authorNameText
          }
          >
            This post was created by:  {post.author}
          </Text>
          <TouchableOpacity
            onPress={() => {
              this.textToSpeech(
                post.author,
                post.caption
              )
            }}
          >
            <Ionicons
              name={this.state.speakerIcon}
              size={RFValue(30)}
              color={
                this.state.lightTheme ? "red" : this.state.speakerColor
              }
              style={styles.speakerIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.props.navigation.goBack()}>
            <Text style={
              this.state.lightTheme ? styles.backButtonLight : styles.backButton
            }>Back to Home</Text>
          </TouchableOpacity>
        </View>
      )
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black'
  },
  droidSafeArea: {
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : RFValue(35)
  },
  containerLight: {
    flex: 1,
    backgroundColor: 'white'
  },
  appTitle: {
    flex: 0.07,
    flexDirection: "row"
  },
  appIcon: {
    flex: 0.2,
    justifyContent: "center",
    alignItems: "center",
    marginTop: RFValue(10),
    height: RFValue(30)
  },
  iconImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
    backgroundColor: "black"
  },
  appTitleTextContainer: {
    flex: 0.8,
    justifyContent: "center",
    marginTop: 10
  },
  appTitleText: {
    color: "white",
    fontSize: RFValue(20),
    marginTop: RFValue(30),
    fontFamily: "CedarvilleCursive"
  },
  appTitleTextLight: {
    color: "black",
    fontSize: RFValue(20),
    marginTop: RFValue(30),
    fontFamily: "CedarvilleCursive"
  },
  speakerIcon: {
    margin: RFValue(15),
    alignSelf: "center"
  },
  authorNameText: {
    color: "white",
    fontSize: RFValue(10),
    marginTop: RFValue(30),
    textAlign: "center",
    fontFamily: "CedarvilleCursive"
  },
  authorNameTextLight: {
    color: "black",
    fontSize: RFValue(10),
    marginTop: RFValue(30),
    textAlign: "center",
    fontFamily: "CedarvilleCursive"
  },
  postImage: {
    alignSelf: 'center',
    marginTop: RFValue(30),
    height: RFValue(100),
    width: RFValue(100)
  },
  captionText: {
    fontSize: 13,
    color: "white",
    paddingTop: RFValue(10),
    alignSelf: "center",
    fontFamily: "CedarvilleCursive"
  },
  captionTextLight: {
    fontSize: 13,
    color: "black",
    paddingTop: RFValue(10),
    alignSelf: "center",
    fontFamily: "CedarvilleCursive"
  },
  backButton: {
    color: "white",
    textAlign: "center",
    fontFamily: "CedarvilleCursive"
  },
  backButtonLight: {
    color: "black",
    textAlign: "center",
    fontFamily: "CedarvilleCursive"
  }
});