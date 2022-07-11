import { useEffect } from "react";
import { Alert, Platform } from "react-native";
import firebase from "firebase/app";
import "firebase/auth";

import { withNavigation } from "react-navigation";

function Logout(props) {
    useEffect(() => {
        if (Platform.OS === "ios" || Platform.OS === "android") {
            Alert.alert(
                "Logging out",
                "Are you sure you want to log out?",
                [
                    {
                        text: "Yes, I want to log out",
                        onPress: () => firebase.auth().signOut()
                    },
                    {
                        text: "Cancel",
                        onPress: () => props.navigation.goBack(),
                        style: "cancel"
                    }
                ]
            )
        } else {
            firebase.auth().signOut();
        }
    }, [])

    return null;
}

export default withNavigation(Logout);