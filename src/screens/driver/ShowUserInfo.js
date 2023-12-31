import { StyleSheet, Text, View, Image } from "react-native";
import React, { useRef } from "react";
import { useSelector } from "react-redux";
import CustomMarkerImage from "../../assets/car.png";
import CustomMarkerUser from "../../assets/user.png";
import {
  selectDriverLocation,
  selectHomeDestination,
  selectUserProfile,
} from "../../redux/navSlice";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Entypo";

import MapViewDirections from "react-native-maps-directions";
import MapView, { Marker, Callout } from "react-native-maps";
import { GOOGLE_MAPS_APIKEY } from "@env";
import { Pressable } from "react-native";
import { useEffect } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";

import { db } from "../../../config";
import { ref, onValue, set, update, get, off } from "firebase/database";
import { useState } from "react";

const ShowUserInfo = () => {
  const StudentDetails = useSelector(selectHomeDestination);
  const DriverDetails = useSelector(selectDriverLocation);
  const mapRef = useRef(null);
  const navigation = useNavigation();
  const DriverData = useSelector(selectUserProfile);
  const [isDeleted, setIsDeleted] = useState(false);

  useEffect(() => {
    const checkIfAcceptedRef = ref(
      db,
      `Request_To_School/${StudentDetails?.id}`
    );

    onValue(checkIfAcceptedRef, (snapshot) => {
      const studentIsAccepted = snapshot.val();
      if (studentIsAccepted === null) {
        setIsDeleted(true);
      } else {
        setIsDeleted(false);
      }
    });
  }, []);

  const handleAcept = async () => {
    try {
      // Reference to the student's isAccepted field

      if (!isDeleted) {
        set(ref(db, `Request_To_School/${StudentDetails.id}/driver`), {
          coordinates: {
            latitude: DriverDetails.coords.latitude,
            longitude: DriverDetails.coords.longitude,
          },
          info: {
            firstName: DriverData.firstName,
            lastName: DriverData.lastName,
            email: DriverData.contact,
            driverId: DriverData.studentId,
          },
          status: {
            isOnTheWay: true,
          },
        });

        const studentIsBeingViewedRef = ref(
          db,
          `Request_To_School/${StudentDetails.id}/status/isAccepted`
        );

        // Get the current value of isAccepted
        const snapshot = await get(studentIsBeingViewedRef);
        const currentIsAccepted = snapshot.val();

        // Check if the student is already accepted
        if (currentIsAccepted) {
          // Student is already accepted, show an alert
          alert("This user is already accepted by others.");
          navigation.navigate("DriverScanUserGoingSchool");
        } else {
          // Student is not accepted, set isAccepted to true
          await set(studentIsBeingViewedRef, true);

          // Navigate to the next screen
          navigation.navigate("DriverUser");
        }
      } else {
        console.log("error in showUser UseeFFECT");
      }
    } catch (error) {
      console.error("Error updating isAccepted:", error);
    }
  };
  const route = useRoute();

  const { onReject } = route.params || {}; // Retrieve the callback from route params

  const handleReject = () => {
    const updateIsbeingViewedToFalse = ref(
      db,
      `Request_To_School/${StudentDetails.id}/status`
    );
    update(updateIsbeingViewedToFalse, { isBeingReviewed: false })
      .then(() => {
        navigation.replace("DriverScanUserGoingSchool");
      })
      .catch((error) => {
        console.error("Error updating value in the database:", error);
      });
  };
  useEffect(() => {
    if (onReject) {
      // Execute the callback when the route changes
      onReject();
    }
  }, [route]);

  const anchor = { x: 0.1, y: 0.2 };

  if (!isDeleted) {
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
          showsUserLocation={true}
          style={{
            width: "100%",
            height: "62%",
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
              latitude: DriverDetails.coords.latitude,
              longitude: DriverDetails.coords.longitude,
            }}
            destination={{
              latitude: StudentDetails.coordinates.latitude,
              longitude: StudentDetails.coordinates.longitude,
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
              latitude: DriverDetails.coords.latitude,
              longitude: DriverDetails.coords.longitude,
            }}
            title="You"
            identifier="origin"
            image={CustomMarkerImage}
          ></Marker>

          <Marker
            style={{ width: 200, height: 200 }}
            coordinate={{
              latitude: StudentDetails.coordinates.latitude,
              longitude: StudentDetails.coordinates.longitude,
            }}
            identifier="destination"
            pinColor="green"
            anchor={anchor}
          >
            <Image
              source={CustomMarkerUser}
              style={{ width: 50, height: 50 }} // Adjust the size as needed
            />
          </Marker>
        </MapView>
        <View style={styles.UserProfilePicture}>
          <Text></Text>
        </View>
        <View style={styles.UserContainer}>
          <View style={{ position: "absolute", bottom: "18%", width: "100%" }}>
            <Text style={{ color: "black", fontSize: 30, alignSelf: "center" }}>
              {`${StudentDetails.StudentInfo.firstName} ${StudentDetails.StudentInfo.lastName}`}
            </Text>
            <Text style={{ fontSize: 15, alignSelf: "center", color: "gray" }}>
              {`${StudentDetails.StudentInfo.studentId}`}
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
                backgroundColor: "#e65555",
                display: "flex",
                justifyContent: "center",
              }}
              onPress={handleReject}
            >
              <Text
                style={{ alignSelf: "center", fontSize: 18, color: "white" }}
              >
                REJECT
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
              onPress={handleAcept}
            >
              <Text
                style={{ alignSelf: "center", fontSize: 18, color: "white" }}
              >
                ACCEPT
              </Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    );
  } else {
    return (
      <SafeAreaView>
        <View>
          <Text>loading</Text>
        </View>
      </SafeAreaView>
    );
  }
};

export default ShowUserInfo;

const styles = StyleSheet.create({
  ContainerMain: {
    backgroundColor: "#ffc647",
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
    bottom: "19%",
    alignSelf: "center",
    backgroundColor: "#46665C",
    borderRadius: 2000,
  },
});
