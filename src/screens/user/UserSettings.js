import { Button, ImageBackground, StyleSheet, Text, View } from "react-native";
import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { selectUserProfile, setUserIsLoggedin } from "../../redux/navSlice";
import { TouchableOpacity } from "react-native-gesture-handler";
import Entypo from "react-native-vector-icons/Entypo";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";

const UserSettings = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      dispatch(setUserIsLoggedin(""));
      await AsyncStorage.removeItem("drivers");
      await AsyncStorage.removeItem("user");
      await AsyncStorage.removeItem("userInfo");

      navigation.navigate("HomeLogin");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };
  return (
    <View style={{ flex: 1 }}>
      <View style={{ marginTop: "90%" }}>
        <TouchableOpacity
          style={{
            flexDirection: "row", // Arrange icon and text horizontally
            alignItems: "center", // Center items vertically
            backgroundColor: "gray",
            padding: 10,
            width: "100%",
          }}
          onPress={handleLogout}
        >
          <Entypo
            name="log-out"
            size={22}
            color="#ebebeb"
            style={{ paddingLeft: "10%", alignSelf: "center" }}
          />
          <Text style={{ color: "#ebebeb", marginLeft: 10 }}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default UserSettings;

const styles = StyleSheet.create({});
