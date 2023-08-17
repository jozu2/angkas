import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import BigMap from "../../component/BigMap";
import { selectDestination, setDestination } from "../../redux/navSlice";
import { useDispatch, useSelector } from "react-redux";
import Ionicons from "react-native-vector-icons/Ionicons";
const OriginToSchoolMap = () => {
  const dispatch = useDispatch();
  const destination = useSelector(selectDestination);
  return (
    <>
      <View style={styles.container}>
        <BigMap />
      </View>
      {/* {destination === null && (
        <Pressable
          style={styles.checkContainer}
          onPress={() => {
            dispatch(
              setDestination({
                location: {
                  lng: 120.6559842,
                  lat: 14.9977785,
                },
                description:
                  "Don Honorio Ventura State University, Bacolor, Pampanga, Philippines",
              })
            );
          }}
        >
          <Ionicons
            name="md-checkmark-circle"
            size={32}
            color="green"
            style={styles.iconCheck}
          />
        </Pressable>
      )} */}
    </>
  );
};

export default OriginToSchoolMap;

const styles = StyleSheet.create({
  container: {
    height: "100%",
  },
  checkContainer: {
    position: "absolute",
    alignSelf: "center",
    bottom: "10%",
  },
  iconCheck: {
    fontSize: 80,
  },
  BookContainer: {
    position: "absolute",
    alignSelf: "center",
    bottom: "10%",
    zIndex: 200,
  },
});
