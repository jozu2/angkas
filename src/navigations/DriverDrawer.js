import { StyleSheet, Text, View, Button } from "react-native";
import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DriverMain from "../screens/driver/DriverMain";
import DriverProfile from "../screens/driver/DriverProfile";
import DriverChat from "../screens/driver/DriverChat";
import DriverSettings from "../screens/driver/DriverSettings";
import { useNavigation } from "@react-navigation/native";

const DriverDrawer = () => {
  const Drawer = createDrawerNavigator();
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("drivers");
      await AsyncStorage.removeItem("user");
      navigation.navigate("HomeLogin");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Your drawer menu items */}
      <Drawer.Navigator screenOptions={{ headerShown: false }}>
        <Drawer.Screen name="Homes" component={DriverMain} />
        <Drawer.Screen name="Profiles" component={DriverProfile} />
        <Drawer.Screen name="Chats" component={DriverChat} />
        <Drawer.Screen name="Settingss" component={DriverSettings} />
      </Drawer.Navigator>

      {/* Add a Logout button */}
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

export default DriverDrawer;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
