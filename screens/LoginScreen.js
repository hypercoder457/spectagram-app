import React, { useEffect } from "react";
import { useIdTokenAuthRequest } from 'expo-auth-session/providers/google';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Image
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import firebase from "firebase";

export default function LoginScreen() {
  // Here, the "request" variable is the request sent to the Google API,
  // the "response" variable is the response that is gotten from the API after successful sign-in,
  // and the "promptAsync" FUNCTION is the method that opens up the popup window for sign-in.
  const [request, response, promptAsync] = useIdTokenAuthRequest(
    {
      webClientId: '811051214713-128nbv0v1tq7496882v7iu7hticmo020.apps.googleusercontent.com',
    },
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
        onPress={() => promptAsync()}
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
    marginTop: 10
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
    width: "400%",
    height: "400%",
    resizeMode: "contain"
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
    fontSize: RFValue(20),
    fontFamily: "cursive",
    fontStyle: "italic"
  }
});