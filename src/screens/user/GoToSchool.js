import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import InputTextAutoComplete from "../../component/InputTextAutoComplete";
import tw from "twrnc";
import { useNavigation } from "@react-navigation/native";
const GoToSchool = () => {
  const navigation = useNavigation();
  return (
    <View style={tw`pt-10`}>
      <InputTextAutoComplete />
      <Pressable onPress={() => navigation.navigate("OriginToSchoolMap")}>
        <Text>BOOK NOW!</Text>
      </Pressable>
    </View>
  );
};

export default GoToSchool;

const styles = StyleSheet.create({});
