import { StyleSheet, Text, View, Button } from "react-native";
import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import UserHomepage from "../screens/user/UserHomepage";
import UserProfile from "../screens/user/UserProfile";
import UserChat from "../screens/user/UserChat";
import UserSettings from "../screens/user/UserSettings";
import CustomDrawer from "../screens/user/CustomDrawer";
import Feather from "react-native-vector-icons/Feather";
import Ionicons from "react-native-vector-icons/Ionicons";

const SideMenu = () => {
  const Drawer = createDrawerNavigator();

  return (
    <View style={styles.container}>
      <Drawer.Navigator
        drawerContent={(props) => <CustomDrawer {...props} />}
        screenOptions={{
          headerShown: false,
          drawerActiveBackgroundColor: "rgba(191, 65, 45, 0.1)",
          drawerActiveTintColor: "#1c0000",
          drawerInactiveTintColor: "#636363",
          drawerLabelStyle: { marginLeft: -18 },
        }}
      >
        <Drawer.Screen
          name="Home"
          component={UserHomepage}
          options={{
            drawerIcon: ({ color }) => (
              <Feather name="home" size={22} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="Profile"
          component={UserProfile}
          options={{
            drawerIcon: ({ color }) => (
              <Feather name="user" size={22} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="Chat"
          component={UserChat}
          options={{
            drawerIcon: ({ color }) => (
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={22}
                color={color}
              />
            ),
          }}
        />
        <Drawer.Screen
          name="Settings"
          component={UserSettings}
          options={{
            drawerIcon: ({ color }) => (
              <Feather name="settings" size={22} color={color} />
            ),
          }}
        />
      </Drawer.Navigator>
    </View>
  );
};

export default SideMenu;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
