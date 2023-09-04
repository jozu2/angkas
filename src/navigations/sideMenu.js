import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import UserHomepage from "../screens/user/UserHomepage";
import UserProfile from "../screens/user/UserProfile";
import UserChat from "../screens/user/UserChat";
import UserSettings from "../screens/user/UserSettings";

export default function SideMenu() {
  const Drawer = createDrawerNavigator();
  return (
    <Drawer.Navigator screenOptions={{ headerShown: false }}>
      <Drawer.Screen name="Home" component={UserHomepage} />
      <Drawer.Screen name="Profile" component={UserProfile} />
      <Drawer.Screen name="Chat" component={UserChat} />
      <Drawer.Screen name="Settings" component={UserSettings} />
    </Drawer.Navigator>
  );
}
