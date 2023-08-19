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
import { setOrigin } from "../redux/navSlice";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import Ionicons from "react-native-vector-icons/Ionicons";
import tw from "twrnc";
import MapViewDirections from "react-native-maps-directions";
import Geocoder from "react-native-geocoding";

const BigMap = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  Geocoder.init(GOOGLE_MAPS_APIKEY);

  //Resets the states in this component after pressing "ASK FOR A RIDE"
  const resetOriginDescriptionModalNavigate = () => {
    navigation.navigate("Searching");
    setTimeout(() => {
      setOriginCoord({ latitude: 14.9977785, longitude: 120.6559842 });
      setOriginDescription({ description: "" });
      setShowDirection({ check: false, boxModalConfirm: false });
      if (googlePlaceAutoCompleteRef.current?.getAddressText()) {
        googlePlaceAutoCompleteRef.current.setAddressText("");
      }
    }, 1000);
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
            placeholder="Where From?"
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
          icon={require("../assets/imgSchool.png")}
        ></Marker>
      </MapView>

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
              tw`rounded-xl t.bgGray400`,
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
                  {originDescription.description}
                </Text>
              </View>

              <View style={{ marginTop: 13 }}>
                <Text style={{ fontSize: 11, color: "#1a202c" }}>
                  DROP OFF:
                </Text>
              </View>
              <View>
                <Text style={{ fontSize: 16, color: "#1a202c" }}>
                  {schoolDestination.description}
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
              onPress={resetOriginDescriptionModalNavigate}
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

export default BigMap;
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
