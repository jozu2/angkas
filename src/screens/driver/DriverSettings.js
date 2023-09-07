import { View, Text } from "react-native";
import React from "react";
import { Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Pressable } from "react-native";

const DriverSettings = () => {
  const openAppSettings = async () => {
    await Linking.openSettings();
  };
  return (
    <SafeAreaView>
      <Pressable onPress={openAppSettings}>
        <Text>Press Me to open settings</Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default DriverSettings;
