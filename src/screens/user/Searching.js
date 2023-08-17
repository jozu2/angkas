import { Alert, StyleSheet } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Animatable from "react-native-animatable";
import { useNavigation } from "@react-navigation/native";
import { useBackHandler } from "@react-native-community/hooks";
import { useDispatch } from "react-redux";
import { setOrigin } from "../../redux/navSlice";

const Searching = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  //RESETS THE STORED ORIGIN LOCATION IF USER PRESS CANCEL
  const handleNavigateAndResetOrigin = () => {
    dispatch(setOrigin(null));
    navigation.navigate("big");
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
  /////////////////////////////////////////////////////////////

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
