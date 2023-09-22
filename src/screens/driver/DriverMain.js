import { Pressable, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import tw from "twrnc";
import React, { useState } from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";

import * as Location from "expo-location";
import { useEffect } from "react";
import {
  selectDriverLocation,
  setDriverLocation,
  setUserProfile,
} from "../../redux/navSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DriverMain = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [location, setLocation] = useState(null);

  const [isDisabled, setIsDisabled] = useState(true);
  const DriverDetails = useSelector(selectDriverLocation);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();

      const driverFirestore = await AsyncStorage.getItem("driverInfo");

      const driverFirestoreData = JSON.parse(driverFirestore);
      dispatch(setUserProfile(driverFirestoreData));

      if (status !== "granted") {
        console.log("Permission to access location was denied");
        setIsDisabled(true);
        alert("enable your location permission");
        setTimeout(() => {
          navigation.navigate("Settingss");
        }, 2000);

        return;
      }
      setIsDisabled(false);
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);
  useEffect(() => {
    dispatch(setDriverLocation(location));
  }, [location, dispatch]);

  const handleGotoScanUser = async () => {
    if (DriverDetails !== null) {
      navigation.navigate("DriverScanUserGoingSchool");
    } else {
      return;
    }
  };
  return (
    <>
      <View style={[tw`h-1/2 pt-10`, { backgroundColor: "violet" }]}>
        <Ionicons
          onPress={() => navigation.openDrawer()}
          name="menu-outline"
          size={52}
          color="white"
          style={styles.hamburger}
        />
        <Pressable
          style={{
            alignSelf: "center",
            justifyContent: "center",
            marginTop: 200,
            backgroundColor: "white",
            padding: 15,
            width: "60%",
            borderRadius: 10,
          }}
          disabled={isDisabled}
          onPress={handleGotoScanUser}
        >
          <Text style={{ alignSelf: "center", fontSize: 18 }}>
            Scan Users Going School
          </Text>
        </Pressable>
      </View>

      <View style={[tw`h-1/2`, { backgroundColor: "white" }]}>
        <Pressable
          style={{
            alignSelf: "center",
            justifyContent: "center",
            marginTop: 200,
            backgroundColor: "violet",
            padding: 15,
            width: "60%",
            borderRadius: 10,
          }}
          onPress={() => {
            navigation.navigate("DriverScanUserGoingHome");
          }}
        >
          <Text style={{ alignSelf: "center", color: "white", fontSize: 18 }}>
            Scan Users Going Home
          </Text>
        </Pressable>
      </View>
    </>
  );
};

export default DriverMain;
const styles = StyleSheet.create({
  hamburger: {
    position: "absolute",
    left: "3%",
    top: "12%",
  },
});
