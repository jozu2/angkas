import { Pressable, StyleSheet, Text, View, Image } from "react-native";
import React, { useEffect, useRef, useState } from "react";

import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { GOOGLE_MAPS_APIKEY } from "@env";
import MapView, { Marker, Callout } from "react-native-maps";
import {
  selectDriverLocation,
  selectOrigin,
  selectUserId,
  setDriverLocation,
} from "../../redux/navSlice";
import { useDispatch, useSelector } from "react-redux";
import { get, ref, remove, set } from "firebase/database";
import { db } from "../../../config";
import MapViewDirections from "react-native-maps-directions";
import { useNavigation } from "@react-navigation/native";
import * as Animatable from "react-native-animatable";
const UserWaitingToDriver = () => {
  const dispatch = useDispatch();
  const UserID = useSelector(selectUserId);
  const DriverInfo = useSelector(selectDriverLocation);
  const mapRef = useRef(null);
  const StudentDetails = useSelector(selectOrigin);
  const [driverInfoData, setDriverInfoData] = useState(null);
  const [driverDistance, setDriverDistance] = useState(null);
  const [driverLocationDescription, setDriverLocationDescription] =
    useState(null);
  const navigation = useNavigation();

  const [driverETA, setDriverETA] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const dbRef = ref(db, `Request_To_School/${UserID}/driver`);
        const snapshot = await get(dbRef);
        const userData = snapshot.val();
        setDriverInfoData(userData);

        if (StudentDetails) {
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${StudentDetails.location.latitude},${StudentDetails.location.longitude}&destinations=${userData.coordinates.latitude},${userData.coordinates.longitude}&key=${GOOGLE_MAPS_APIKEY}`
          );

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const data = await response.json();

          const travelData = data.rows[0].elements[0]; // Assuming there's only one origin and destination
          setDriverLocationDescription(data.destination_addresses);
          if (travelData.status === "OK") {
            const distance = travelData.distance.text; // Distance in a human-readable format (e.g., "10.5 km")
            const duration = travelData.duration.text; // Duration in a human-readable format (e.g., "30 mins")

            setDriverDistance(distance);
            setDriverETA(duration);
          } else {
            console.error("Unable to retrieve distance and duration.");
          }
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }

    fetchData();
  }, []);

  const handleDecline = async () => {
    try {
      const dbRefRemove = ref(db, `Request_To_School/${UserID}/driver`);
      await remove(dbRefRemove);

      const studentIsBeingReviewedRef = ref(
        db,
        `Request_To_School/${UserID}/status/isBeingReviewed`
      );
      const snapshot = await get(studentIsBeingReviewedRef);
      const currentisBeingReviewed = snapshot.val();

      if (currentisBeingReviewed) {
        await set(studentIsBeingReviewedRef, false);
      }

      const studentIsAcceptedRef = ref(
        db,
        `Request_To_School/${UserID}/status/isAccepted`
      );
      const snapshotAccepted = await get(studentIsAcceptedRef);
      const currentIsAccepted = snapshotAccepted.val();

      if (currentIsAccepted) {
        await set(studentIsAcceptedRef, false);
      }

      const studentIsDeclinedRef = ref(
        db,
        `Request_To_School/${UserID}/status/isDeclined`
      );
      const snapshotDeclined = await get(studentIsDeclinedRef);
      const currentIsDeclined = snapshotDeclined.val();

      if (!currentIsDeclined) {
        await set(studentIsDeclinedRef, true);
      }
    } catch (error) {
      console.error("theres an error:", error);
    }

    setDriverDistance(null);
    setDriverETA(null);
    setDriverInfoData(null);
    setDriverLocationDescription(null);
    navigation.replace("Searching");
  };

  const [openProfile, setOpenProfile] = useState(false);

  const handleConfirm = async () => {
    try {
      const studentIsCOnfirmedRef = ref(
        db,
        `Request_To_School/${UserID}/status/isConfirmed`
      );
      const snapshotConfirmed = await get(studentIsCOnfirmedRef);
      const currentisConfirmed = snapshotConfirmed.val();

      if (!currentisConfirmed) {
        await set(studentIsCOnfirmedRef, true);
        navigation.navigate("OtwDriverUserToSchool");
      }
    } catch (error) {
      console.error("theres an error:", error);
    }
  };

  const openProfileModal = () => {
    setOpenProfile(true);
  };
  const hideModal = () => {
    setOpenProfile(false);
  };

  return (
    <View>
      {driverInfoData &&
      driverDistance &&
      driverETA &&
      driverLocationDescription ? (
        <SafeAreaView style={styles.ContainerMain}>
          <View style={{ position: "absolute", top: "7%", width: "100%" }}>
            <Text style={{ color: "white", fontSize: 22, alignSelf: "center" }}>
              You Found Your Captain
            </Text>
          </View>
          <View style={styles.InputBox}>
            <View>
              <Text style={styles.InputBox.PickupDROP}>
                <Text>
                  <Ionicons
                    name="hourglass-outline"
                    size={15}
                    color="#36A71A"
                  />
                </Text>
                <Text>{`  -  ESTIMATED TIME OF ARRIVAL & DISTANCE`}</Text>
              </Text>
              <Text
                style={styles.InputBox.Text}
              >{`   ${driverETA} / ${driverDistance}`}</Text>
            </View>
            <View>
              <Text style={styles.InputBox.PickupDROP}>
                <Text>
                  <Ionicons name="car-sport-sharp" color="#C70039" size={15} />
                </Text>

                <Text>{`  -  DRIVER LOCATION`}</Text>
              </Text>
              <Text style={[styles.InputBox.Text, { paddingBottom: 12 }]}>
                {driverLocationDescription}
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
              strokeColor="#ffc647"
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
              title="Driver"
              identifier="origin"
            ></Marker>

            <Marker
              style={{ width: 200, height: 200 }}
              coordinate={{
                latitude: StudentDetails.location.latitude,
                longitude: StudentDetails.location.longitude,
              }}
              title="You"
              identifier="destination"
              pinColor="green"
            ></Marker>
          </MapView>

          <Pressable
            style={styles.UserProfilePicture}
            onPress={openProfileModal}
          >
            <Text></Text>
          </Pressable>

          <Pressable style={styles.DriverChat}>
            <Text>
              <Ionicons name="chatbubble-ellipses" size={58} color="#ffc647" />
            </Text>
          </Pressable>

          <Pressable style={styles.DriverCall}>
            <Text
              style={{
                alignSelf: "center",
                padding: 5,
                borderWidth: 1,
                borderColor: "#c4c4c4",
                borderRadius: 5000,
                transform: [{ scaleX: -1 }],
              }}
            >
              <Ionicons name="call" size={48} color="#b03013" />
            </Text>
          </Pressable>

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
                onPress={handleDecline}
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
                onPress={handleConfirm}
              >
                <Text
                  style={{ alignSelf: "center", fontSize: 18, color: "white" }}
                >
                  CONFIRM
                </Text>
              </Pressable>
            </View>
          </View>

          <Pressable
            style={{
              width: "100%",
              height: "125%",
              backgroundColor: "transparent",
              zIndex: 300000,
              flex: 1,
              position: "absolute",
              display: openProfile ? "block" : "none",
            }}
            onPress={hideModal}
          >
            <Animatable.View
              animation={openProfile ? "fadeIn" : "fadeOut"} // Apply fade-in or fade-out animation based on openProfile value
              duration={1000} // Set the animation duration in milliseconds
              style={{
                backgroundColor: "white",
                width: "97%",
                alignSelf: "center",
                borderWidth: 3,
                borderTopColor: "white",
                borderRightColor: "gray",
                height: "70%",
                top: "10%",
                zIndex: 3000000,
                position: "absolute",
                borderRadius: 30,
              }}
            >
              <View>
                <Image
                  source={require("../../assets/CarSamplePicture.jpg")} // Replace with the actual path to your image
                  style={{
                    width: "100%",
                    height: 200,
                    borderTopRightRadius: 30,
                    borderTopLeftRadius: 30,
                  }} // Set the width and height of the image
                />
              </View>
              <View
                style={{
                  backgroundColor: "#fafafa",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    marginLeft: "10%",
                  }}
                >
                  <View>
                    <Text
                      style={{
                        fontSize: 27,
                        paddingTop: "5%",

                        color: "black",
                      }}
                    >{`${driverInfoData.info.firstName} ${driverInfoData.info.lastName}`}</Text>
                  </View>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      paddingBottom: "1%",
                    }}
                  >
                    <MaterialIcons name="star-rate" size={23} color="#ffc647" />
                    <MaterialIcons name="star-rate" size={23} color="#ffc647" />
                    <MaterialIcons name="star-half" size={23} color="#ffc647" />
                    <MaterialIcons
                      name="star-outline"
                      size={23}
                      color="#ffc647"
                    />
                    <MaterialIcons
                      name="star-outline"
                      size={23}
                      color="#ffc647"
                    />
                  </View>
                  <View style={{ paddingBottom: "4%" }}>
                    <Text>2.5</Text>
                  </View>
                </View>
                <View style={{ marginRight: "12%", paddingTop: "2.5%" }}>
                  <View
                    style={{
                      width: 86,
                      height: 86,
                      backgroundColor: "gray",
                      borderRadius: 3000,
                    }}
                  ></View>
                </View>
              </View>
              <View style={{ marginTop: 40 }}>
                <Text>{`Email: ${driverInfoData.info.email}`} </Text>
                <Text>{`ID: ${driverInfoData.info.driverId}`} </Text>
                <Text>{`Contact No. : `} </Text>
              </View>
            </Animatable.View>
          </Pressable>
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
      fontSize: 16,
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
    width: "25%",
    height: "15%",
    position: "absolute",
    zIndex: 10,
    bottom: "20.5%",
    alignSelf: "left",
    marginLeft: "5%",
    backgroundColor: "white",
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#fc5421",
  },
  DriverChat: {
    position: "absolute",
    zIndex: 11,
    bottom: "20.5%",
    right: "30%",
    backgroundColor: "white",
    borderRadius: 5000,
    borderColor: "#c4c4c4",
    borderWidth: 1,
  },
  DriverCall: {
    position: "absolute",
    zIndex: 11,
    bottom: "20.5%",
    right: "10%",
    backgroundColor: "white",
    borderRadius: 5000,
  },
});
