import { StyleSheet, Alert, ActivityIndicator, Text } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Animatable from "react-native-animatable";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { useBackHandler } from "@react-native-community/hooks";
import { GOOGLE_MAPS_APIKEY } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage

import { db } from "../../../config";
import { ref, onValue, get, update, set } from "firebase/database";
import { useState, useEffect } from "react";
import {
  selectDriverLocation,
  selectHomeDestination,
  setHomeDestination,
  setUserId,
} from "../../redux/navSlice";

const DriverScanUserGoingSchool = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const getUserID = useSelector(selectHomeDestination);
  const [requestToSchoolData, setRequestDataToSchool] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [fetchedRequestIds, setFetchedRequestIds] = useState([]);
  useEffect(() => {
    async function fetchData() {
      try {
        const dbRef = ref(db, "Request_To_School");
        const snapshot = await get(dbRef);
        const requestData = snapshot.val();
        const requests = Object.keys(requestData).map((key) => ({
          id: key,
          ...requestData[key],
        }));

        const filteredRequests = requests.filter((request) => {
          return !request.isBeingReviewed && !request.isAccepted;
        });

        if (filteredRequests.length > 0) {
          const randomIndex = Math.floor(
            Math.random() * filteredRequests.length
          );
          const randomRequest = filteredRequests[randomIndex];

          const studentIsBeingViewedRef = ref(
            db,
            `Request_To_School/${randomRequest.id}/status/isBeingReviewed`
          );
          await set(studentIsBeingViewedRef, true);

          setRequestDataToSchool(randomRequest);
          setIsDataFetched(true);
          setIsLoading(false);
        } else {
          setIsDataFetched(false);
          setIsLoading(true);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (requestToSchoolData !== null) {
      dispatch(setHomeDestination(requestToSchoolData));
    }
  }, [requestToSchoolData]);
  const handleNavigateAndResetOrigin = async () => {
    try {
      const studentIsBeingViewedRef = ref(
        db,
        `Request_To_School/${getUserID.id}/status/isBeingReviewed`
      );

      // You can set the value and then wait for it if needed
      await set(studentIsBeingViewedRef, false);

      console.log("this is text", getUserID.id);
      navigation.navigate("DriverMain");
      setIsDataFetched(false);
      setRequestDataToSchool(null);
      setIsLoading(true);
    } catch (error) {
      console.error("Error:", error);
    }
  };
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

  if (isLoading) {
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
