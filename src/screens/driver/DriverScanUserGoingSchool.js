import { StyleSheet, Alert, ActivityIndicator, Text } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Animatable from "react-native-animatable";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { useBackHandler } from "@react-native-community/hooks";

import { db } from "../../../config";
import { ref, onValue } from "firebase/database";
import { useState, useEffect } from "react";
import { setHomeDestination, setUserId } from "../../redux/navSlice";

const DriverScanUserGoingSchool = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [requestToSchoolData, setRequestDataToSchool] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDataFetched, setIsDataFetched] = useState(false);

  // useFocusEffect(
  //   React.useCallback(() => {
  //     const dbRef = ref(db, "Request_To_School");
  //     onValue(dbRef, (snapshot) => {
  //       const data = snapshot.val();
  //       const newRequest = Object.keys(data).map((key) => ({
  //         id: key,
  //         ...data[key],
  //       }));

  //       const randomIndex = Math.floor(Math.random() * newRequest.length);
  //       const randomRequest = newRequest[randomIndex];

  //       setRequestDataToSchool(randomRequest);
  //       dispatch(setHomeDestination(randomRequest));
  //       setIsDataFetched(true);
  //       setIsLoading(false);
  //     });
  //   }, [])
  // );

  useEffect(() => {
    const dbRef = ref(db, "Request_To_School");
    onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      const newRequest = Object.keys(data).map((key) => ({
        id: key,
        ...data[key],
      }));

      const randomIndex = Math.floor(Math.random() * newRequest.length);
      const randomRequest = newRequest[randomIndex];

      setRequestDataToSchool(randomRequest);
      dispatch(setHomeDestination(randomRequest));
      setIsDataFetched(true);
      setIsLoading(false);
    });
  }, []);

  console.log(requestToSchoolData);
  function backActionHandler() {
    Alert.alert("", "Are you sure you want to Cancel?", [
      {
        text: "No",
        onPress: () => null,
        style: "cancel",
      },
      {
        text: "Yes",
        onPress: handleNavigateAndResetOrigin,
      },
    ]);
    return true;
  }

  useBackHandler(backActionHandler);

  const handleNavigateAndResetOrigin = () => {
    navigation.navigate("DriverMain");
    setIsDataFetched(false);
    setRequestDataToSchool(null);
    setIsLoading(true);
  };

  // Conditional rendering based on isLoading and isDataFetched
  if (isLoading && isLoading) {
    return (
      <SafeAreaView style={styles.SearchContainer}>
        <Animatable.Image
          style={{ height: 250, width: 250, marginTop: 100 }}
          animation={"slideInUp"}
          iterationCount={1}
          source={require("../../assets/radar.gif")}
        />

        <Animatable.Text
          animation={"slideInUp"}
          iterationCount={1}
          style={{ fontSize: 20, marginTop: 50 }}
        >
          Scanning Users
        </Animatable.Text>

        <Animatable.Image
          style={{ height: 70, width: 70, marginTop: 20 }}
          animation={"slideInUp"}
          iterationCount={1}
          source={require("../../assets/loading.gif")}
        />

        <Animatable.Text
          onPress={handleNavigateAndResetOrigin}
          animation={"slideInUp"}
          iterationCount={1}
          style={{ fontSize: 15, marginTop: 30 }}
        >
          Cancel
        </Animatable.Text>
      </SafeAreaView>
    );
  }

  if (isDataFetched) {
    setTimeout(() => {
      navigation.navigate("ShowUserInfo");
    }, 2000);
    setIsDataFetched(false);
    setRequestDataToSchool(null);
    setIsLoading(true);
  }
};

export default DriverScanUserGoingSchool;

const styles = StyleSheet.create({
  SearchContainer: {
    backgroundColor: "white",
    flex: 1,
    alignItems: "center",
  },
  LoadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
