import { Pressable, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import tw from "twrnc";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
const UserHomepage = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView>
      <View style={[tw`h-1/2 pt-10`, { backgroundColor: "orange" }]}>
        <Pressable
          style={{
            alignSelf: "center",
            justifyContent: "center",
            marginTop: 200,
            backgroundColor: "white",
            padding: 15,
            width: "60%",
            borderRadius: 10,
          }}
          onPress={() => {
            navigation.navigate("UserGotoScoolMap");
          }}
        >
          <Text style={{ alignSelf: "center", fontSize: 20 }}>
            Go to School
          </Text>
        </Pressable>
      </View>

      <View style={[tw`h-1/2`, { backgroundColor: "white" }]}>
        <Pressable
          style={{
            alignSelf: "center",
            justifyContent: "center",
            marginTop: 200,
            backgroundColor: "red",
            padding: 15,
            width: "60%",
            borderRadius: 10,
          }}
          onPress={() => {
            navigation.navigate("UserGotoHomeMap");
          }}
        >
          <Text style={{ alignSelf: "center", color: "white", fontSize: 20 }}>
            Go Home
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default UserHomepage;

const styles = StyleSheet.create({});
