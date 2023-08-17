import { Text, View, SafeAreaView, TextInput } from "react-native";
("react-native");
import React, { useEffect } from "react";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { GOOGLE_MAPS_APIKEY } from "@env";
import { useDispatch } from "react-redux";
import { setDestination, setOrigin } from "../redux/navSlice";

const InputTextAutoComplete = () => {
  const dispatch = useDispatch();

  return (
    <View>
      <GooglePlacesAutocomplete
        styles={{
          container: {
            position: "absolute",
            zIndex: 100,
            flex: 0,
            width: "85%",
            alignSelf: "center",
          },
          textInput: {
            width: 200,
            fontSize: 18,
          },
        }}
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
          dispatch(
            setOrigin({
              location: details.geometry.location,
              description: data.description,
            })
          );
        }}
        fetchDetails={true}
        returnKeyType={"search"}
      />
    </View>
  );
};

export default InputTextAutoComplete;
