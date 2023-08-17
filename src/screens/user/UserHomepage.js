import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import tw from "twrnc";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import InputTextAutoComplete from "../../component/InputTextAutoComplete";
const UserHomepage = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  return (
    <>
      <View style={tw`h-1/2 pt-10`}>
        <Pressable
          onPress={() => {
            navigation.navigate("OriginToSchoolMap");
          }}
        >
          <Text>Go to School</Text>
        </Pressable>
        <InputTextAutoComplete />
        <Pressable onPress={() => navigation.navigate("OriginToSchoolMap")}>
          <Text style={{ marginTop: 100 }}>BOOK NOW!</Text>
        </Pressable>
      </View>

      {/* if the user home is null = will prompt a msg to add the home location */}
      <View style={tw`h-1/2`}>
        <Pressable onPress={() => navigation.navigate("map")}>
          <Text>Going Home</Text>
        </Pressable>
      </View>
    </>
  );
};

export default UserHomepage;

const styles = StyleSheet.create({});
