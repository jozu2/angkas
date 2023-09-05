import HomeLogin from "../screens/Login/HomeLogin";
import StudentLogin from "../screens/Login/StudentLogin";
import StudentRegistration from "../screens/Login/StudentRegistration";
import DriverLogin from "../screens/Login/DriverLogin";
import DriverRegistration from "../screens/Login/DriverRegistration";

import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

const AuthNavigator = () => {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator initialRouteName="HomeLogin">
      <Stack.Screen name="HomeLogin" component={HomeLogin} />
      <Stack.Screen name="StudentLogin" component={StudentLogin} />
      <Stack.Screen
        name="StudentRegistration"
        component={StudentRegistration}
      />
      <Stack.Screen name="DriverLogin" component={DriverLogin} />
      <Stack.Screen name="DriverRegistration" component={DriverRegistration} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
