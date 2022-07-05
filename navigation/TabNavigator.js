import React from 'react';
import { StyleSheet } from "react-native";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RFValue } from "react-native-responsive-fontsize";

import Feed from "../screens/Feed";
import CreatePost from "../screens/CreatePost";

const Tab = createMaterialBottomTabNavigator();

export default class BottomTabNavigator extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isUpdated: true,
            lightTheme: true
        }
    }

    renderFeed = props => {
        return <Feed setUpdateToFalse={this.removeUpdated} {...props} />
    }

    renderCreatePost = props => {
        return <CreatePost setUpdateToTrue={this.changeUpdated} {...props} />
    }

    changeUpdated = () => {
        this.setState({ isUpdated: true });
    };

    removeUpdated = () => {
        this.setState({ isUpdated: false });
    };
    
    render() {
        return (
            <Tab.Navigator
                labeled={false}
                barStyle={styles.bottomTabStyle}
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName;
                        if (route.name === "Feed") {
                            iconName = focused ? "home" : "home-outline";
                        } else if (route.name === "Create Post") {
                            iconName = focused ? "add-circle" : "add-circle-outline";
                        }
                        return (
                            <Ionicons
                                name={iconName}
                                size={RFValue(25)}
                                color={color}
                                style={styles.icons}
                            />
                        );
                    }
                })}
                activeColor="#ee8249"
                inactiveColor="gray"
            >
                <Tab.Screen name="Feed" component={this.renderFeed} />
                <Tab.Screen name="Create Post" component={this.renderCreatePost} />
            </Tab.Navigator>
        );
    }
}

const styles = StyleSheet.create({
    bottomTabStyle: {
        backgroundColor: "#2a2a2a",
        height: "8%",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        overflow: "hidden",
        position: "absolute"
    },
    icons: {
        width: RFValue(30),
        height: RFValue(30)
    }
});
