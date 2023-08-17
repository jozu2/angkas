import tw from "twrnc";
import React, { useRef, useState } from "react";
import MapView, { Marker } from "react-native-maps";
import { selectOrigin, setOrigin } from "../redux/navSlice";
import { useDispatch, useSelector } from "react-redux";
import MapViewDirections from "react-native-maps-directions";
import { GOOGLE_MAPS_APIKEY } from "@env";
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import Geocoder from "react-native-geocoding";
const BigMap = () => {
  const origin = useSelector(selectOrigin);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  Geocoder.init(GOOGLE_MAPS_APIKEY);

  const resetOriginDescriptionModalNavigate = () => {
    navigation.navigate("Searching");
    setTimeout(() => {
      setOriginCoord({ latitude: 14.9977785, longitude: 120.6559842 });
      setOriginDescription({ description: "" });
      setShowDirection({ check: false, boxModalConfirm: false });
      if (googlePlaceAutoCompleteRef.current?.getAddressText()) {
        googlePlaceAutoCompleteRef.current.setAddressText(""); // Clear input field
      }
    }, 1000); // Change the delay time (in milliseconds) as needed
  };

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
  const schoolDestination = {
    location: {
      longitude: 120.6559842,
      latitude: 14.9977785,
    },
    description: "Don Honorio Ventura State University, Bacolor, Pampanga",
  };
  const mapRef = useRef(null);

  const googlePlaceAutoCompleteRef = useRef(null);
  return (
    <>
      <View
        style={{
          position: "absolute",
          width: "100%",
          top: "10%",
        }}
      >
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

        <Marker
          style={{ width: 200, height: 200 }}
          coordinate={schoolDestination.location}
          title="School"
          description={schoolDestination.description}
          identifier="destination"
          icon={require("../assets/imgSchool.png")}
        ></Marker>
      </MapView>

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

      {showDirection.boxModalConfirm === true && (
        <View
          style={{
            position: "absolute",
            width: 200,
            alignSelf: "center",
            bottom: "5%",
            width: "95%",
          }}
        >
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
            {/* <Text style={styles.textOriginDest}>
              Origin: {originDescription.description}
            </Text>
            <Text style={styles.textOriginDest}>
              Origin: {originDescription.description}
            </Text> */}
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
