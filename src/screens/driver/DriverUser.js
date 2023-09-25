import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { db } from "../../../config";
import { off, onValue, ref } from "firebase/database";
import { useNavigation } from "@react-navigation/native";
import { selectHomeDestination } from "../../redux/navSlice";
import { useSelector } from "react-redux";

const DriverUser = () => {
  const navigation = useNavigation();
  const StudentInfo = useSelector(selectHomeDestination);
  useEffect(() => {
    const checkIfDeclinedRef = ref(
      db,
      `Request_To_School/${StudentInfo.id}/status/isDeclined`
    );
    if (checkIfDeclinedRef) {
      onValue(checkIfDeclinedRef, (snapshot) => {
        const studentIsDeclined = snapshot.val();
        if (studentIsDeclined) {
          navigation.replace("DriverScanUserGoingSchool");
        } else {
          // Student is not accepted
        }
      });
    }

    const checkIfConfirmedRef = ref(
      db,
      `Request_To_School/${StudentInfo.id}/status/isConfirmed`
    );
    if (checkIfConfirmedRef) {
      onValue(checkIfConfirmedRef, (snapshot) => {
        const studentIsConfirmed = snapshot.val();
        if (studentIsConfirmed) {
          navigation.navigate("DriverOTWtoUserSchool");
        } else {
          // Student is not accepted
        }
      });
    }

    return () => {
      // Detach the listener to avoid memory leaks
      off(checkIfDeclinedRef);
    };
  }, []);

  return (
    <View>
      <Text style={{ fontSize: 25, marginTop: 255, alignSelf: "center" }}>
        Waiting for User Confirmation
      </Text>
    </View>
  );
};

export default DriverUser;

const styles = StyleSheet.create({});
