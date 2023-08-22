import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import UserHomepage from "../screens/user/UserHomepage";
import UserGotoHomeMap from "../screens/user/UserGotoHomeMap";

export default function SideMenu() {
  const Drawer = createDrawerNavigator();
  return (
    <Drawer.Navigator screenOptions={{ headerShown: false }}>
      <Drawer.Screen name="UserHomepage" component={UserHomepage} />
    </Drawer.Navigator>
  );
}
