import { Alert, StyleSheet } from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Animatable from "react-native-animatable";
import { useNavigation } from "@react-navigation/native";
import { useBackHandler } from "@react-native-community/hooks";
import { useDispatch, useSelector } from "react-redux";
import {
  selectUserId,
  setDriverLocation,
  setOrigin,
} from "../../redux/navSlice";
import { get, off, onValue, ref, remove } from "firebase/database";
import { useState } from "react";
import { db } from "../../../config";

const Searching = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const UserID = useSelector(selectUserId);
  const [UID, setUID] = useState(useSelector(selectUserId));

  //RESETS THE STORED ORIGIN LOCATION IF USER PRESS CANCEL
  const handleNavigateAndResetOrigin = () => {
    const dbRefCancel = ref(db, "Request_To_School/" + UID);
    remove(dbRefCancel);
    dispatch(setOrigin(null));
    navigation.navigate("UserGotoScoolMap");
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
  //////LOGIC///////////////////////////////////////////////////////

  useEffect(() => {
    const checkIfAcceptedRef = ref(
      db,
      `Request_To_School/${UserID}/status/isAccepted`
    );

    // Create a listener for changes in isAccepted
    onValue(checkIfAcceptedRef, (snapshot) => {
      const studentIsAccepted = snapshot.val();

      if (studentIsAccepted) {
        // Student is accepted, show an alert
        navigation.navigate("UserWaitingToDriver");
      } else {
        // Student is not accepted
        // You may choose to handle this case differently
      }
    });

    // Cleanup the listener when the component unmounts
    return () => {
      // Detach the listener to avoid memory leaks
      off(checkIfAcceptedRef);
    };
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const dbRef = ref(db, `Request_To_School/${UserID}`);
        const snapshot = await get(dbRef);
        const requestData = snapshot.val();
        console.log("Fetched data:", requestData); // Log the fetched data

        if (requestData !== null) {
          dispatch(setDriverLocation(requestData));
        } else {
          console.log("Specific item not found at the specified path.");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <SafeAreaView style={styles.SearchContainer}>
      <Animatable.Image
        style={{ height: 250, width: 250, marginTop: 100 }}
        animation={"slideInUp"}
        iterationCount={1}
        source={require("../../assets/SearchingDuck.gif")}
      />

      <Animatable.Text
        animation={"slideInUp"}
        iterationCount={1}
        style={{ fontSize: 20, marginTop: 50 }}
      >
        Waiting for Someone to Pick you up
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
};

export default Searching;

const styles = StyleSheet.create({
  SearchContainer: {
    backgroundColor: "white",
    flex: 1,

    alignItems: "center",
  },
});
