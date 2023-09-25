import { Button, StyleSheet, View } from "react-native";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import {
  selectDriverLocation,
  selectHomeDestination,
} from "../../redux/navSlice";
import * as Linking from "expo-linking"; // Import Linking from expo-linking

const DriverOTWtoUserSchool = () => {
  const StudentDetails = useSelector(selectHomeDestination);
  const DriverDetails = useSelector(selectDriverLocation);

  const driverLatitude = DriverDetails.coords.latitude;
  const driverLongitude = DriverDetails.coords.longitude;
  const commuterLatitude = StudentDetails.coordinates.latitude;
  const commuterLongitude = StudentDetails.coordinates.longitude;

  const openGoogleMapsDirections = () => {
    const origin = `${driverLatitude},${driverLongitude}`;
    const destination = `${commuterLatitude},${commuterLongitude}`;
    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;

    Linking.openURL(url).catch((err) =>
      console.error("An error occurred: ", err)
    );
  };

  const handleOpenMaps = () => {
    openGoogleMapsDirections();
  };

  return (
    <View>
      <Button title="Open Google Maps" onPress={handleOpenMaps} />
    </View>
  );
};

export default DriverOTWtoUserSchool;

const styles = StyleSheet.create({});
