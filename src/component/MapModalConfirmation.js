import { StyleSheet, Text, View } from "react-native";
import React from "react";

const MapModalConfirmation = () => {
  return (
    <View style={styles.containerMain}>
      <View>
        <Text>MapModalConfirmation</Text>
      </View>
    </View>
  );
};

export default MapModalConfirmation;

const styles = StyleSheet.create({
  containerMain: {
    position: "absolute",
    width: "90%",
    height: 500,
    justifyContent: "center",
    alignSelf: "center",
    backgroundColor: "red",
    zIndex: 1000,
  },
});
