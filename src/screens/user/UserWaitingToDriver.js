import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Entypo";
import { GOOGLE_MAPS_APIKEY } from "@env";
import MapView, { Marker, Callout } from "react-native-maps";
import {
  selectDriverLocation,
  selectOrigin,
  selectUserId,
  setDriverLocation,
} from "../../redux/navSlice";
import { useDispatch, useSelector } from "react-redux";
import { get, ref } from "firebase/database";
import { db } from "../../../config";
import MapViewDirections from "react-native-maps-directions";

const UserWaitingToDriver = () => {
  const dispatch = useDispatch();

  const UserID = useSelector(selectUserId);
  const DriverInfo = useSelector(selectDriverLocation);
  const mapRef = useRef(null);
  const StudentDetails = useSelector(selectOrigin);

  const [driverInfoData, setDriverInfoData] = useState(null);
  useEffect(() => {
    async function fetchData() {
      try {
        const dbRef = ref(db, `Request_To_School/${UserID}/driver`);
        const snapshot = await get(dbRef);
        const userData = snapshot.val();
        setDriverInfoData(userData);
      } catch (error) {
        console.error("Error:", error);
      }
    }

    fetchData();
  }, []);

  console.log(StudentDetails);
  return (
    <View>
      {driverInfoData ? (
        <SafeAreaView style={styles.ContainerMain}>
          <View style={{ position: "absolute", top: "7%", width: "100%" }}>
            <Text style={{ color: "white", fontSize: 18, alignSelf: "center" }}>
              You Have Found Your Captain
            </Text>
          </View>
          <View style={styles.InputBox}>
            <View>
              <Text style={styles.InputBox.PickupDROP}>
                <Text>
                  <Ionicons name="address" size={15} color="#36A71A" />
                </Text>
                <Text> - ESTIMATED TIME OF ARRIVAL & DISTANCE</Text>
              </Text>
              <Text style={styles.InputBox.Text}>test</Text>
            </View>
            <View>
              <Text style={styles.InputBox.PickupDROP}>
                <Text>
                  <Ionicons name="forward" color="#C70039" size={15} />
                </Text>

                <Text>- DRIVER LOCATION</Text>
              </Text>
              <Text style={[styles.InputBox.Text, { paddingBottom: 12 }]}>
                Don Honorio Ventura School, Bacolor
              </Text>
            </View>
          </View>

          <MapView
            ref={mapRef}
            showsUserLocation={true}
            style={{
              width: "100%",
              height: "62%",
              zIndex: 1,
              marginTop: "35%",
              borderBottomLeftRadius: 22,
            }}
            region={{
              latitude: StudentDetails.location.latitude,
              longitude: StudentDetails.location.longitude,
              latitudeDelta: 0.045,
              longitudeDelta: 0.045,
            }}
          >
            <MapViewDirections
              origin={{
                latitude: driverInfoData.coordinates.latitude,
                longitude: driverInfoData.coordinates.longitude,
              }}
              destination={{
                latitude: StudentDetails.location.latitude,
                longitude: StudentDetails.location.longitude,
              }}
              apikey={GOOGLE_MAPS_APIKEY}
              strokeWidth={4}
              identifier="destination"
              strokeColor="green"
              optimizeWaypoints={true}
              onReady={(result) => {
                if (mapRef.current) {
                  mapRef.current.fitToCoordinates(result.coordinates, {
                    edgePadding: { top: 110, right: 50, bottom: 110, left: 50 },
                  });
                }
              }}
            />

            <Marker
              style={{ width: 200, height: 200 }}
              coordinate={{
                latitude: driverInfoData.coordinates.latitude,
                longitude: driverInfoData.coordinates.longitude,
              }}
              title="You"
              identifier="origin"
            ></Marker>

            <Marker
              style={{ width: 200, height: 200 }}
              coordinate={{
                latitude: StudentDetails.location.latitude,
                longitude: StudentDetails.location.longitude,
              }}
              identifier="destination"
              pinColor="green"
            ></Marker>
          </MapView>

          <View style={styles.UserProfilePicture}>
            <Text></Text>
          </View>
          <View style={styles.UserContainer}>
            <View
              style={{ position: "absolute", bottom: "18%", width: "100%" }}
            >
              <Text
                style={{ color: "black", fontSize: 30, alignSelf: "center" }}
              >
                {`${driverInfoData.info.firstName} ${driverInfoData.info.lastName}`}
              </Text>
              <Text
                style={{ fontSize: 15, alignSelf: "center", color: "gray" }}
              >
                {driverInfoData.info.driverId}
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
                  backgroundColor: "#b03013",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{ alignSelf: "center", fontSize: 18, color: "white" }}
                >
                  DECLINE
                </Text>
              </Pressable>
            </View>
            <View style={{ flex: 1 }}>
              <Pressable
                style={{
                  flex: 1,
                  backgroundColor: "#ffc647",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{ alignSelf: "center", fontSize: 18, color: "white" }}
                >
                  CONFIRM
                </Text>
              </Pressable>
            </View>
          </View>
        </SafeAreaView>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
};

export default UserWaitingToDriver;

const styles = StyleSheet.create({
  ContainerMain: {
    backgroundColor: "#b03013",
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
    borderBottomColor: "gray",
    borderTopColor: "white",
    borderRightColor: "gray",
    borderLeftColor: "black",

    borderWidth: 1,
    Text: {
      marginLeft: "9%",
      color: "black",
      fontSize: 17,
      color: "rgba(0,0,0,0.94)",
    },
    PickupDROP: {
      paddingTop: 12,
      width: "100%",
      color: "#b03013",
      paddingLeft: 15,
      fontSize: 14,
    },
  },
  UserContainer: {
    width: "100%",
    backgroundColor: "white",
    borderTopWidth: 1,
    borderLeftWidth: 1.2,
    borderRightWidth: 1.2,
    borderRightColor: "gray",

    borderTopColor: "gray",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: "15%",
    position: "absolute",
    bottom: "9%",
    zIndex: 9,
  },
  UserProfilePicture: {
    width: "30%",
    height: "15%",
    position: "absolute",
    zIndex: 10,
    bottom: "20.5%",
    alignSelf: "center",
    backgroundColor: "#46665C",
    borderRadius: 15,
  },
});
