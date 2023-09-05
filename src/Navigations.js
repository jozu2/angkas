import { View, Text } from "react-native";
import React from "react";
import { useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";

import AuthNavigator from "./navigations/AuthNavigator";
import { selectUserIsLoggedIn, setUserIsLoggedin } from "./redux/navSlice";
import { useDispatch, useSelector } from "react-redux";
import UserNavigation from "./navigations/user";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoadingScreen from "./component/LoadingScreen";
import DriverDrawer from "./navigations/DriverDrawer";

const Navigations = () => {
  const [isLoading, setIsLoading] = useState(true);
  const Stack = createStackNavigator();
  const isStudent = useSelector(selectUserIsLoggedIn);
  const dispatch = useDispatch();
  useEffect(() => {
    checkUserAuthentication();
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const checkUserAuthentication = async () => {
    try {
      const user = await AsyncStorage.getItem("user");
      const driver = await AsyncStorage.getItem("driver");
      if (user) {
        dispatch(setUserIsLoggedin("student"));
        setTimeout(() => {
          setIsLoading(false); // Set loading to false after 2 seconds
        }, 2000); // 2000 milliseconds (2 seconds)
      }
      if (driver) {
        dispatch(setUserIsLoggedin("driver"));
        setTimeout(() => {
          setIsLoading(false); // Set loading to false after 2 seconds
        }, 2000); // 2000 milliseconds (2 seconds)
      }
    } catch (error) {
      console.error("Error checking user authentication:", error);
    }
  };

  return (
    <>
      {isLoading ? (
        // You can render a loading indicator here while checking authentication.
        <Stack.Navigator>
          <Stack.Screen name="Loading" component={LoadingScreen} />
        </Stack.Navigator>
      ) : isStudent === "student" ? (
        <UserNavigation />
      ) : isStudent === "driver" ? (
        <DriverDrawer />
      ) : (
        <AuthNavigator />
      )}
    </>
  );
};

export default Navigations;
