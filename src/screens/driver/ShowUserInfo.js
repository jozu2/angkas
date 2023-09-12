import { StyleSheet, Text, View } from "react-native";
import React, { useRef } from "react";
import { useSelector } from "react-redux";
import {
  selectDriverLocation,
  selectHomeDestination,
} from "../../redux/navSlice";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Entypo";

import MapViewDirections from "react-native-maps-directions";
import MapView, { Marker } from "react-native-maps";
import { GOOGLE_MAPS_APIKEY } from "@env";
import { Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { db } from "../../../config";
import { ref, onValue, set, update } from "firebase/database";

const ShowUserInfo = () => {
  const StudentDetails = useSelector(selectHomeDestination);
  const DriverDetails = useSelector(selectDriverLocation);
  const mapRef = useRef(null);
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.ContainerMain}>
      <View style={{ position: "absolute", top: "7%", width: "100%" }}>
        <Text style={{ color: "white", fontSize: 30, alignSelf: "center" }}>
          User Detected
        </Text>
      </View>
      <View style={styles.InputBox}>
        <View>
          <Text style={styles.InputBox.PickupDROP}>
            <Text>
              <Ionicons name="address" size={15} color="#36A71A" />
            </Text>
            <Text> ----- PICKUP FROM</Text>
          </Text>
          <Text style={styles.InputBox.Text}>
            {StudentDetails.coordinates.location}
          </Text>
        </View>
        <View>
          <Text style={styles.InputBox.PickupDROP}>
            <Text>
              <Ionicons name="forward" color="#C70039" size={15} />
            </Text>

            <Text> ----- DROP OFF</Text>
          </Text>
          <Text style={[styles.InputBox.Text, { paddingBottom: 12 }]}>
            Don Honorio Ventura School, Bacolor
          </Text>
        </View>
      </View>

      <MapView
        ref={mapRef}
        showsMyLocationButton={true}
        showsUserLocation={true}
        style={{
          width: "100%",
          height: "55%",
          zIndex: 1,
          marginTop: "35%",
          borderBottomLeftRadius: 22,
        }}
        region={{
          latitude: StudentDetails.coordinates.latitude,
          longitude: StudentDetails.coordinates.longitude,
          latitudeDelta: 0.045,
          longitudeDelta: 0.045,
        }}
      >
        <MapViewDirections
          origin={{
            latitude: StudentDetails.coordinates.latitude,
            longitude: StudentDetails.coordinates.longitude,
          }}
          destination={{
            latitude: DriverDetails.coords.latitude,
            longitude: DriverDetails.coords.longitude,
          }}
          apikey={GOOGLE_MAPS_APIKEY}
          strokeWidth={4}
          identifier="destination"
          strokeColor="green"
          optimizeWaypoints={true}
          onReady={(result) => {
            if (mapRef.current) {
              mapRef.current.fitToCoordinates(result.coordinates, {
                edgePadding: { top: 40, right: 40, bottom: 40, left: 40 },
              });
            }
          }}
        />

        <Marker
          style={{ width: 200, height: 200 }}
          coordinate={{
            latitude: DriverDetails.coords.latitude,
            longitude: DriverDetails.coords.longitude,
          }}
          title="You"
          identifier="origin"
        ></Marker>

        <Marker
          style={{ width: 200, height: 200 }}
          coordinate={{
            latitude: StudentDetails.coordinates.latitude,
            longitude: StudentDetails.coordinates.longitude,
          }}
          title="3 MIN"
          description="User"
          identifier="destination"
          pinColor="green"
        ></Marker>
      </MapView>
      <View style={styles.UserProfilePicture}>
        <Text></Text>
      </View>
      <View style={styles.UserContainer}>
        <View style={{ position: "absolute", bottom: "18%", width: "100%" }}>
          <Text style={{ color: "black", fontSize: 30, alignSelf: "center" }}>
            Joshua Melendres
          </Text>
        </View>
      </View>

      <View
        style={{
          width: "100%",
          height: "9%",
          backgroundColor: "blue",
          position: "absolute",
          zIndex: 11,
          bottom: 0,
          flexDirection: "row", // Set flexDirection to 'row'
        }}
      >
        <View style={{ flex: 1 }}>
          <Pressable
            style={{
              flex: 1,
              backgroundColor: "#597E72",
              display: "flex",
              justifyContent: "center",
            }}
            onPress={() => {
              navigation.navigate("DriverScanUserGoingSchool"); // Go back to the previous screen
            }}
          >
            <Text style={{ alignSelf: "center", fontSize: 18, color: "white" }}>
              REJECT
            </Text>
          </Pressable>
        </View>
        <View style={{ flex: 1 }}>
          <Pressable
            style={{
              flex: 1,
              backgroundColor: "#95D3BF",
              display: "flex",
              justifyContent: "center",
            }}
            onPress={async () => {
              try {
                // Create an object with the updated isAccepted field
                const updates = {};
                updates[
                  "Request_To_School/" + `${StudentDetails.id}/` + "isAccepted/"
                ] = true;

                // Update the database with the new value
                await update(ref(db), updates);

                // Navigate to the next screen
                navigation.navigate("DriverScanUserGoingSchool");
              } catch (error) {
                console.error("Error updating isAccepted:", error);
              }
            }}
          >
            <Text style={{ alignSelf: "center", fontSize: 18, color: "white" }}>
              ACCEPT
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ShowUserInfo;

const styles = StyleSheet.create({
  ContainerMain: {
    backgroundColor: "#49967E",
    height: "100%",
    width: "100%",
  },
  InputBox: {
    top: "15%",
    position: "absolute",
    zIndex: 10,
    borderRadius: 10,
    width: "94%",
    alignSelf: "center",
    backgroundColor: "white",
    Text: {
      marginLeft: "9%",
      color: "black",
      fontSize: 17,
      color: "rgba(0,0,0,0.94)",
    },
    PickupDROP: {
      paddingTop: 12,
      width: "100%",
      color: "rgba(0,0,0,0.5)",
      paddingLeft: 15,
      fontSize: 14,
    },
  },
  UserContainer: {
    width: "100%",
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: "20%",
    position: "absolute",
    bottom: "9%",
    zIndex: 9,
  },
  UserProfilePicture: {
    width: "36%",
    height: "18%",
    position: "absolute",
    zIndex: 10,
    bottom: "20%",
    alignSelf: "center",
    backgroundColor: "#46665C",
    borderRadius: 2000,
  },
});
