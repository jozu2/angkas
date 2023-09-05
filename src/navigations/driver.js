import { View, Text } from "react-native";
import React from "react";
import DriverDrawer from "./DriverDrawer";
import { createStackNavigator } from "@react-navigation/stack";

const Driver = () => {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DriverMain" component={DriverDrawer} />
    </Stack.Navigator>
  );
};

export default Driver;
