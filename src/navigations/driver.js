import { View, Text } from "react-native";
import React from "react";
import DriverDrawer from "./DriverDrawer";
import { createStackNavigator } from "@react-navigation/stack";
import DriverScanUserGoingSchool from "../screens/driver/DriverScanUserGoingSchool";
import DriverScanUserGoingHome from "../screens/driver/DriverScanUserGoingHome";
import ShowUserInfo from "../screens/driver/ShowUserInfo";
import DriverUser from "../screens/driver/DriverUser";

const Driver = () => {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="DriverMain"
    >
      <Stack.Screen name="DriverMain" component={DriverDrawer} />
      <Stack.Screen
        name="DriverScanUserGoingSchool"
        component={DriverScanUserGoingSchool}
      />
      <Stack.Screen
        name="DriverScanUserGoingHome"
        component={DriverScanUserGoingHome}
      />
      <Stack.Screen name="ShowUserInfo" component={ShowUserInfo} />
      <Stack.Screen name="DriverUser" component={DriverUser} />
    </Stack.Navigator>
  );
};

export default Driver;
