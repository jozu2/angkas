import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import UserHomepage from "../screens/user/UserHomepage";

const MainNavUser = () => {
  const Drawer = createDrawerNavigator();
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="UserHomepage" component={UserHomepage} />
    </Drawer.Navigator>
  );
};

export default MainNavUser;

const styles = StyleSheet.create({});
