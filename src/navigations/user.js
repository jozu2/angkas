import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import UserHomepage from "../screens/user/UserHomepage";

import Searching from "../screens/user/Searching";
import UserGotoScoolMap from "../screens/user/UserGotoScoolMap";
import UserGotoHomeMap from "../screens/user/UserGotoHomeMap";
import SearchinSchoolToHomeRide from "../screens/user/SearchinSchoolToHomeRide";
import SideMenu from "./sideMenu";

const UserNavigation = () => {
  const Stack = createStackNavigator();

  return (
    <>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="drawer" component={SideMenu} />

        <Stack.Screen name="UserGotoScoolMap" component={UserGotoScoolMap} />
        <Stack.Screen name="UserGotoHomeMap" component={UserGotoHomeMap} />
        <Stack.Screen
          name="Searching"
          component={Searching}
          options={{ presentation: "fullScreenModal" }}
        />
        <Stack.Screen
          name="SearchinSchoolToHomeRide"
          component={SearchinSchoolToHomeRide}
          options={{ presentation: "fullScreenModal" }}
        />
      </Stack.Navigator>
    </>
  );
};

export default UserNavigation;

const styles = StyleSheet.create({});
