import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useRef, useState } from "react";
import MapView, { Marker } from "react-native-maps";
import { GOOGLE_MAPS_APIKEY } from "@env";
import { setHomeDestination } from "../../redux/navSlice";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { useBackHandler } from "@react-native-community/hooks";
import Ionicons from "react-native-vector-icons/Ionicons";
import tw from "twrnc";
import MapViewDirections from "react-native-maps-directions";
import Geocoder from "react-native-geocoding";

const UserGotoHomeMap = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  Geocoder.init(GOOGLE_MAPS_APIKEY);

  //Resets the states in this component after pressing "ASK FOR A RIDE"
  const resetOriginDescriptionModalNavigate = () => {
    setTimeout(() => {
      setHomeCoord({ latitude: 14.9977785, longitude: 120.6559842 });
      setHomeDescription({ description: "" });
      setShowDirection({ check: false, boxModalConfirm: false });
      if (googlePlaceAutoCompleteRef.current?.getAddressText()) {
        googlePlaceAutoCompleteRef.current.setAddressText("");
      }
    }, 1000);
  };
  //MAP DATA
  const mapRef = useRef(null);
  const googlePlaceAutoCompleteRef = useRef(null);
  const [homeCoord, setHomeCoord] = useState({
    latitude: 14.9977785,
    longitude: 120.6559842,
  });
  const [homeDescription, setHomeDescription] = useState({
    description: "",
  });
  const [showDirection, setShowDirection] = useState({
    check: false,
    boxModalConfirm: false,
  });

  //School Data for MARKER
  const school = {
    location: {
      longitude: 120.6559842,
      latitude: 14.9977785,
    },
    description: "Don Honorio Ventura State University, Bacolor, Pampanga",
  };

  // Resets data when user go backs

  function backActionHandler() {
    resetOriginDescriptionModalNavigate();
    navigation.navigate("UserHomepage");

    return true;
  }
  useBackHandler(backActionHandler);

  return (
    <>
      {/* Google auto complete Input field */}
      <View style={styles.apContainer}>
        {showDirection.boxModalConfirm === false && (
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
                    color={"black"}
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
            placeholder="Where to?"
            nearbyPlacesAPI="GooglePlacesSearch"
            debounce={400}
            minLength={2}
            enablePoweredByContainer={false}
            onPress={(data, details = null) => {
              setHomeCoord({
                latitude: details.geometry.location.lat,
                longitude: details.geometry.location.lng,
              });
              setHomeDescription({ description: data.description });
            }}
            fetchDetails={true}
            returnKeyType={"search"}
          />
        )}
      </View>

      {/* /////////THE MAP SHOWN IN FULL SCREEN////////// */}
      <MapView
        showsMyLocationButton={true}
        showsUserLocation={true}
        ref={mapRef}
        style={tw`flex-1`}
        region={{
          latitude: homeCoord.latitude,
          longitude: homeCoord.longitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.015,
        }}
      >
        {/* //////////////// MAP DIRECTIONS //////////////*/}
        {homeCoord.latitude !== 14.9977785 && showDirection.check && (
          <MapViewDirections
            origin={{
              latitude: homeCoord.latitude,
              longitude: homeCoord.longitude,
            }}
            destination={school.description}
            identifier="destination"
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
        {homeCoord.latitude !== 14.9977785 && (
          <Marker
            draggable
            coordinate={{
              latitude: homeCoord.latitude,
              longitude: homeCoord.longitude,
            }}
            title="Drag me"
            description={homeDescription.description}
            identifier="destination"
            isPreselected={true}
            onDragEnd={async (e) => {
              const newCoordinate = e.nativeEvent.coordinate;
              setHomeCoord(newCoordinate);

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

                setHomeDescription({ description: formattedAddress });
              } catch (error) {
                console.error("Error Fetching Address", error);
              }
            }}
          />
        )}

        {/* ///////// Destination Marker(SCHOOL LOCATION)  /////////*/}
        <Marker
          style={{ width: 200, height: 200 }}
          coordinate={school.location}
          title="School"
          description={school.description}
          identifier="origin"
        ></Marker>
      </MapView>

      {/* // CHECK ICON, this will show after placing your origin marker ////*/}
      {homeDescription.description !== "" && showDirection.check === false && (
        <Pressable
          style={styles.checkContainer}
          onPress={() => {
            dispatch(
              setHomeDestination({
                location: homeCoord,
                description: homeDescription.description,
              })
            );
            setShowDirection({ check: true, boxModalConfirm: true });
          }}
        >
          <Ionicons
            name="md-checkmark-circle"
            size={32}
            color="orange"
            style={styles.iconCheck}
          />
        </Pressable>
      )}

      {/* ///////// MODAL. contains the ORIGIN AND DESTINATION address(will show after pressing the CHECK ICON)/////////*/}
      {showDirection.boxModalConfirm === true && (
        <View style={styles.modalContainerOriginTODes}>
          <View
            style={[
              tw`rounded-xl `,
              {
                backgroundColor: "#ecc94b",
                paddingTop: 35,
                paddingBottom: 30,
                paddingLeft: 20,
                paddingRight: 20,
              },
            ]}
          >
            <View style={styles.ModalText}>
              <View>
                <Text style={{ fontSize: 11, color: "#1a202c" }}>
                  PICKUP FROM:
                </Text>
              </View>
              <View>
                <Text style={{ fontSize: 16, color: "#1a202c" }}>
                  {school.description}
                </Text>
              </View>

              <View style={{ marginTop: 13 }}>
                <Text style={{ fontSize: 11, color: "#1a202c" }}>
                  DROP OFF:
                </Text>
              </View>
              <View>
                <Text style={{ fontSize: 16, color: "#1a202c" }}>
                  {homeDescription.description}
                </Text>
              </View>
            </View>

            {/* //BUTTON will send the origin data to the REQUEST db in FIrebase///// */}
            {/* WIP */}
            <Pressable
              style={[
                tw`rounded-xl`,
                {
                  paddingVertical: 11,
                  backgroundColor: "white",
                  marginTop: 20,
                },
              ]}
              onPress={() => {
                resetOriginDescriptionModalNavigate;
                navigation.navigate("SearchinSchoolToHomeRide");
              }}
            >
              <Text style={{ textAlign: "center", fontSize: 20 }}>
                Ask For a Ride
              </Text>
            </Pressable>
          </View>
        </View>
      )}
    </>
  );
};

export default UserGotoHomeMap;
const styles = StyleSheet.create({
  modalContainerOriginTODes: {
    position: "absolute",
    width: 200,
    alignSelf: "center",
    bottom: "5%",
    width: "95%",
  },
  apContainer: {
    position: "absolute",
    width: "100%",
    top: "10%",
  },
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
  clearButton: {
    alignSelf: "center",
  },
  googleAutoStyle: {
    container: {
      left: "5%",
      top: "15%",
      position: "absolute",
      zIndex: 100,
      flex: 0,
      width: "90%",
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
    marginLeft: "8%",
  },
});
