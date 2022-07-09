import React, { useEffect } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Image,
  Platform
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

import * as AuthSession from "expo-auth-session";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import AppLoading from "expo-app-loading";

import {
  useFonts,
  CedarvilleCursive_400Regular as CedarvilleCursive
} from "@expo-google-fonts/cedarville-cursive";

import Constants from "expo-constants";

export default function LoginScreen() {
  let [fontsLoaded] = useFonts({ CedarvilleCursive });
  let extraAppValues = Constants.manifest.extra;

  if (Platform.OS === "android") {
    useEffect(() => {
      WebBrowser.warmUpAsync(); // The browser is slow while testing, so "warm it up" in the background to avoid slowness!
      return () => WebBrowser.coolDownAsync(); // after the browser is initialized in the background, stop it using coolDownAsync function
    })
  }

  // Here, the "request" variable is the request sent to the Google API,
  // the "response" variable is the response that is gotten from the API after successful sign-in,
  // and the "promptAsync" FUNCTION is the method that opens up the popup window for sign-in.
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest(
    {
      webClientId: extraAppValues.webClientId,
      expoClientId: extraAppValues.expoClientId,
      androidClientId: '811051214713-rimvkn3k00fj6ssddcf669h20npgdv8b.apps.googleusercontent.com'
    }
  );

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      const provider = new firebase.auth.GoogleAuthProvider();
      const credential = provider.credential(id_token);
      // Sign in with the credential from the id token converted into a credential.
      firebase
        .auth()
        .signInWithCredential(credential)
        .then(function (result) {
          if (result.additionalUserInfo.isNewUser) {
            firebase
              .database()
              .ref(`/users/${result.user.uid}`)
              .set({
                current_theme: "dark"
              })
          }
        })
    }
  }, [response])


  if (!fontsLoaded) {
    return <AppLoading />
  }

  return (
    <View style={styles.container}>
      <View style={styles.appTitle}>
        <View style={styles.appIcon}>
          <Image
            source={require("../assets/logo.png")}
            style={styles.iconImage}
          ></Image>
        </View>
        <View style={styles.appTitleTextContainer}>
          <Text style={styles.appTitleText}>Spectagram</Text>
        </View>
      </View>
      <TouchableOpacity
        disabled={!request}
        onPress={() => promptAsync({
          redirectUri: AuthSession.makeRedirectUri({
            native: 'com.whitehatcoder.spectagramapp:/oauthredirect'
          })
        })}
        style={styles.signInButton}
      >
        <Image
          source={require('../assets/google_icon.png')}
          style={styles.googleLogo}>
        </Image>
        <Text style={styles.signInText}>Log in with Google</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#25D9D9"
  },
  signInButton: {
    width: RFValue(250),
    height: RFValue(50),
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    borderRadius: RFValue(30),
    backgroundColor: "red",
    marginBottom:  (Platform.OS === "android" || Platform.OS === "ios") ? RFValue(60) : null
  },
  signInText: {
    color: "white",
    fontSize: RFValue(18)
  },
  googleLogo: {
    width: RFValue(30),
    height: RFValue(30),
    resizeMode: "contain"
  },
  iconImage: {
    width: (Platform.OS === "android" || Platform.OS === "ios") ? "100%" : "250%",
    height: "400%",
    resizeMode: "contain",
    marginTop: (Platform.OS === "android" || Platform.OS === "ios") ? RFValue(120) : RFValue(20)
  },
  appTitle: {
    justifyContent: "center",
    textAlign: "center"
  },
  appIcon: {
    flex: 0.2,
    justifyContent: "center",
    alignItems: "center"
  },
  appTitleTextContainer: {
    flex: 0.8,
    justifyContent: "center"
  },
  appTitleText: {
    color: "white",
    fontSize: (Platform.OS === "android" || Platform.OS === "ios") ? RFValue(40) : RFValue(20),
    fontFamily: "CedarvilleCursive",
    fontStyle: "italic"
  }
});