import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import MapView, { Marker } from "react-native-maps";
import { GOOGLE_MAPS_APIKEY } from "@env";
import {
  selectOrigin,
  selectUserId,
  selectUserProfile,
  setOrigin,
  setUserIsLoggedin,
  setUserProfile,
} from "../../redux/navSlice";
import { useDispatch, useSelector } from "react-redux";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { useBackHandler } from "@react-native-community/hooks";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import tw from "twrnc";
import MapViewDirections from "react-native-maps-directions";
import Geocoder from "react-native-geocoding";
import { ref, set, remove } from "firebase/database";
import { db } from "./../../../config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Animatable from "react-native-animatable";

const UserGotoScoolMap = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  Geocoder.init(GOOGLE_MAPS_APIKEY);
  const userInfo = useSelector(selectUserProfile);
  //Resets the states in this component after pressing "ASK FOR A RIDE"
  const resetOriginDescriptionModalNavigate = () => {
    setTimeout(() => {
      setOriginCoord({ latitude: 14.9977785, longitude: 120.6559842 });
      setOriginDescription({ description: "" });
      setShowDirection({ check: false, boxModalConfirm: false });
      if (googlePlaceAutoCompleteRef.current?.getAddressText()) {
        googlePlaceAutoCompleteRef.current.setAddressText("");
      }
    }, 1000);
  };

  const origin = useSelector(selectOrigin);
  const userProfile = useSelector(selectUserProfile);
  ////////////////////////////////////////////////////////

  const [UID, setUID] = useState(useSelector(selectUserId));
  useEffect(() => {
    checkForUID();
  }, []);

  const checkForUID = async () => {
    try {
      const user = await AsyncStorage.getItem("user");

      if (user) {
        const userData = JSON.parse(user);
        const userUID = userData.uid;
        setUID(userUID);
        // You might want to set userLoggedIn status in Redux based on your needs.
        dispatch(setUserIsLoggedin("student"));
      } else if (driver) {
        // Handle the driver case in a similar manner if needed.
      }
    } catch (error) {
      console.error("Error checking user authentication:", error);
    }
  };

  const RequestGoToSchool = () => {
    set(ref(db, "Request_To_School/" + UID), {
      coordinates: {
        latitude: origin.location.latitude,
        longitude: origin.location.longitude,
        location: origin.description,
      },
      StudentInfo: {
        firstName: userProfile.firstName,
        lastName: userProfile.lastName,
        studentId: userProfile.studentId,
      },
      status: {
        isAccepted: false,
        isBeingReviewed: false,
        isConfirmed: false,
        isDeclined: false,
      },
    });
    resetOriginDescriptionModalNavigate();
    navigation.navigate("Searching");
  };

  //MAP DATA
  const mapRef = useRef(null);
  const googlePlaceAutoCompleteRef = useRef(null);
  const [originCoord, setOriginCoord] = useState({
    latitude: 14.9977785,
    longitude: 120.6559842,
  });
  const [originDescription, setOriginDescription] = useState({
    description: "",
  });
  const [showDirection, setShowDirection] = useState({
    check: false,
    boxModalConfirm: false,
  });

  //School Data for MARKER
  const schoolDestination = {
    location: {
      longitude: 120.6559842,
      latitude: 14.9977785,
    },
    description: "Don Honorio Ventura State University, Bacolor, Pampanga",
  };

  // Resets data when user go backs
  const handleNavigateAndResetOrigin = () => {
    dispatch(setOrigin(null));
    navigation.navigate("big");
  };
  function backActionHandler() {
    resetOriginDescriptionModalNavigate();
    navigation.navigate("Home");

    return true;
  }
  useBackHandler(backActionHandler);

  const handleOpenDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };
  return (
    <>
      {/* Google auto complete Input field */}
      <View style={styles.apContainer}>
        {showDirection.boxModalConfirm === false && (
          <View
            style={{
              backgroundColor: "#242424",
              zIndex: 2000,
              paddingTop: 40,
              height: 180,
            }}
          >
            <Text
              style={{
                color: "#fff",
                paddingLeft: 30,
                fontSize: 28,
                marginTop: 20,
                fontWeight: "600",
              }}
            >
              Where Are You?
            </Text>
            <GooglePlacesAutocomplete
              renderRightButton={() =>
                googlePlaceAutoCompleteRef.current?.getAddressText() ? (
                  <TouchableOpacity
                    style={styles.clearButton}
                    onPress={() => {
                      googlePlaceAutoCompleteRef.current?.setAddressText("");
                    }}
                  >
                    <Ionicons
                      name={"close-outline"}
                      color={"#fff"}
                      size={35}
                      style={{ paddingLeft: "3%" }}
                    />
                  </TouchableOpacity>
                ) : null
              }
              ref={googlePlaceAutoCompleteRef}
              styles={styles.googleAutoStyle}
              query={{
                key: GOOGLE_MAPS_APIKEY,
                language: "en",
              }}
              placeholder="Input your location"
              nearbyPlacesAPI="GooglePlacesSearch"
              debounce={400}
              minLength={2}
              enablePoweredByContainer={false}
              onPress={(data, details = null) => {
                setOriginCoord({
                  latitude: details.geometry.location.lat,
                  longitude: details.geometry.location.lng,
                });
                setOriginDescription({ description: data.description });
              }}
              fetchDetails={true}
              returnKeyType={"search"}
            />
          </View>
        )}
      </View>

      {/* /////////THE MAP SHOWN IN FULL SCREEN////////// */}
      <MapView
        showsMyLocationButton={true}
        showsUserLocation={true}
        ref={mapRef}
        style={tw`flex-1`}
        region={{
          latitude: originCoord.latitude,
          longitude: originCoord.longitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.015,
        }}
      >
        {/* //////////////// MAP DIRECTIONS //////////////*/}
        {originCoord.latitude !== 14.9977785 && showDirection.check && (
          <MapViewDirections
            origin={{
              latitude: originCoord.latitude,
              longitude: originCoord.longitude,
            }}
            destination={schoolDestination.description}
            identifier="origin"
            apikey={GOOGLE_MAPS_APIKEY}
            strokeWidth={4}
            strokeColor="green"
            optimizeWaypoints={true}
            onReady={(result) => {
              mapRef.current.fitToCoordinates(result.coordinates, {
                edgePadding: { top: 102, right: 32, bottom: 330, left: 32 },
              });
            }}
          />
        )}

        {/* //// Origin Marker Location && get the coord address (draggable) /////*/}
        {originCoord.latitude !== 14.9977785 && (
          <Marker
            draggable
            coordinate={{
              latitude: originCoord.latitude,
              longitude: originCoord.longitude,
            }}
            title="You"
            description={originDescription.description}
            identifier="origin"
            isPreselected={true}
            onDragEnd={async (e) => {
              const newCoordinate = e.nativeEvent.coordinate;
              setOriginCoord(newCoordinate);

              try {
                const response = await Geocoder.from(
                  newCoordinate.latitude,
                  newCoordinate.longitude
                );

                const addressComponents =
                  response.results[0].address_components;
                const excludedTypes = ["route", "street_address", "plus_code"];
                const filteredComponents = addressComponents.filter(
                  (component) =>
                    !excludedTypes.some((type) =>
                      component.types.includes(type)
                    )
                );

                const formattedAddress = filteredComponents
                  .map((component) => component.long_name)
                  .join(", ");

                setOriginDescription({ description: formattedAddress });
              } catch (error) {
                console.error("Error Fetching Address", error);
              }
            }}
          />
        )}

        {/* ///////// Destination Marker(SCHOOL LOCATION)  /////////*/}
        <Marker
          style={{ width: 200, height: 200 }}
          coordinate={schoolDestination.location}
          title="School"
          description={schoolDestination.description}
          identifier="destination"
        ></Marker>
      </MapView>

      <View>
        {showDirection.boxModalConfirm === false && (
          <View
            style={{
              position: "absolute",
              height: 85,

              backgroundColor: "#242424",
              zIndex: 30,
              width: "100%",
              bottom: 0,
              // borderTopLeftRadius: 15,
              // borderTopRightRadius: 15,
            }}
          >
            <View
              style={{
                height: 80,
                width: 80,
                backgroundColor: "#ebebeb",
                alignSelf: "center",
                borderRadius: 500,
                borderWidth: 2,
                borderColor: "black",
                top: -40,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MaterialIcons
                name="my-location"
                size={49}
                color="black"
                style={{}}
              />
            </View>
            <MaterialIcons
              name="home-filled"
              size={35}
              color="white"
              style={{ position: "absolute", left: 40, top: 20 }}
            />
          </View>
        )}
      </View>
      {/* // CHECK ICON, this will show after placing your origin marker ////*/}
      {originDescription.description !== "" &&
        showDirection.check === false && (
          <Pressable
            style={styles.checkContainer}
            onPress={() => {
              dispatch(
                setOrigin({
                  location: originCoord,
                  description: originDescription.description,
                })
              );
              setShowDirection({ check: true, boxModalConfirm: true });
            }}
          >
            <Animatable.View
              animation="fadeIn"
              iterationCount="infinite"
              direction="alternate"
              duration={1000}
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Ionicons
                name="arrow-redo-sharp"
                size={22}
                color="#fff"
                style={styles.iconCheck}
              />
            </Animatable.View>
          </Pressable>
        )}

      {/* ///////// MODAL. contains the ORIGIN AND DESTINATION address(will show after pressing the CHECK ICON)/////////*/}
      {showDirection.boxModalConfirm === true && (
        <View style={styles.modalContainerOriginTODes}>
          <View
            style={[
              {
                backgroundColor: "white",
                paddingTop: 35,
                paddingBottom: 30,
                paddingLeft: 20,
                paddingRight: 20,
              },
            ]}
          >
            <View style={styles.ModalText}>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <MaterialIcons name="pin-drop" size={35} color={"#282828"} />
                <View style={{ paddingLeft: 10 }}>
                  <Text
                    style={{
                      fontSize: 11,
                      color: "#1a202c",
                      fontWeight: "600",
                    }}
                  >
                    PICKUP FROM:
                  </Text>

                  <Text style={{ fontSize: 16, color: "#1a202c" }}>
                    {originDescription.description}
                  </Text>
                </View>
              </View>

              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 10,
                }}
              >
                <FontAwesome5 name="school" size={26} color={"#282828"} />

                <View style={{ paddingLeft: 10, paddingVertical: 15 }}>
                  <Text
                    style={{
                      fontSize: 11,
                      color: "#1a202c",
                      fontWeight: "600",
                    }}
                  >
                    DROP OFF:
                  </Text>

                  <Text style={{ fontSize: 16, color: "#1a202c" }}>
                    {schoolDestination.description}
                  </Text>
                </View>
              </View>
            </View>

            {/* //BUTTON will send the origin data to the REQUEST db in FIrebase///// */}
            {/* WIP */}
            <Pressable
              style={[
                tw`rounded-xl`,
                {
                  paddingVertical: 11,
                  backgroundColor: "#242424",
                  marginTop: 20,
                },
              ]}
              onPress={RequestGoToSchool}
            >
              <Text
                style={{ textAlign: "center", fontSize: 20, color: "#fff" }}
              >
                ASK FOR A RIDE
              </Text>
            </Pressable>
          </View>
        </View>
      )}
    </>
  );
};

export default UserGotoScoolMap;
const styles = StyleSheet.create({
  modalContainerOriginTODes: {
    position: "absolute",
    width: 200,
    alignSelf: "center",
    bottom: "0%",
    borderWidth: 2,
    borderColor: "black",
    width: "100%",
  },
  apContainer: {
    position: "absolute",
    width: "100%",
    alignSelf: "center",
    top: 0,
  },
  container: {
    height: "100%",
  },
  checkContainer: {
    position: "absolute",
    bottom: 20,
    right: 30,
    zIndex: 200,
  },
  iconCheck: {
    fontSize: 50,
    paddingLeft: 10,
  },
  BookContainer: {
    position: "absolute",
    alignSelf: "center",
    bottom: "10%",
    zIndex: 200,
  },
  clearButton: {
    alignSelf: "center",
  },
  googleAutoStyle: {
    container: {
      left: "5%",
      top: "65%",
      position: "absolute",
      zIndex: 100,
      flex: 0,
      width: "90%",
      paddingVertical: 20,
    },
    textInput: {
      width: 200,
      fontSize: 18,
    },
  },
  textOriginDest: {
    fontSize: 14,
    color: "black",
    padding: 15,
    textAlign: "center",
  },

  ModalText: {
    marginLeft: "2%",
    paddingRight: 30,
  },
});
