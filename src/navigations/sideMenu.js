import { StyleSheet, Text, View, Button } from "react-native";
import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import UserHomepage from "../screens/user/UserHomepage";
import UserProfile from "../screens/user/UserProfile";
import UserChat from "../screens/user/UserChat";
import UserSettings from "../screens/user/UserSettings";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { setUserIsLoggedin } from "../redux/navSlice";

const SideMenu = () => {
  const Drawer = createDrawerNavigator();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const handleLogout = async () => {
    try {
      dispatch(setUserIsLoggedin(""));
      await AsyncStorage.removeItem("drivers");
      await AsyncStorage.removeItem("user");

      navigation.navigate("HomeLogin"); // Change to the appropriate login screen
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Your drawer menu items */}
      <Drawer.Navigator screenOptions={{ headerShown: false }}>
        <Drawer.Screen name="Home" component={UserHomepage} />
        <Drawer.Screen name="Profile" component={UserProfile} />
        <Drawer.Screen name="Chat" component={UserChat} />
        <Drawer.Screen name="Settings" component={UserSettings} />
      </Drawer.Navigator>

      {/* Add a Logout button */}
      {/* <Button title="Logout" onPress={handleLogout} /> */}
    </View>
  );
};

export default SideMenu;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
