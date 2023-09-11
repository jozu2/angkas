import {
  Image,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Animated,
  Easing,
} from "react-native";
import React from "react";
import { Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as Animatable from "react-native-animatable";

const { width, height } = Dimensions.get("screen");

const SlideItem = ({ item }) => {
  const translateYImage = new Animated.Value(40);
  const navigation = useNavigation();

  Animated.timing(translateYImage, {
    toValue: 0,
    duration: 1000,
    useNativeDriver: true,
    easing: Easing.easeInOut,
  }).start();

  return (
    <View style={[styles.container, { backgroundColor: item.color }]}>
      <Pressable onPress={() => navigation.navigate(item.uri)}>
        <Text style={styles.description}>{item.description}</Text>
      </Pressable>

      <View style={styles.imageMainContainer}>
        <Animated.Image
          source={item.img}
          resizeMode="contain"
          style={[
            styles.image,
            {
              transform: [
                {
                  translateY: translateYImage,
                },
              ],
            },
          ]}
        />
        <Animated.Image
          source={item.imgTwo}
          resizeMode="contain"
          style={[
            styles.imageTwo,
            {
              transform: [
                {
                  translateY: translateYImage,
                },
              ],
            },
          ]}
        />
        <Animated.Image
          source={item.img3}
          resizeMode="contain"
          style={[
            styles.imagethree,
            {
              transform: [
                {
                  translateY: translateYImage,
                },
              ],
            },
          ]}
        />
      </View>
    </View>
  );
};

export default SlideItem;

const styles = StyleSheet.create({
  imageMainContainer: {
    width: "100%",
    height: "100%",
  },
  container: {
    width,
    height,
  },
  image: {
    height: 700,
    width: "100%",
    bottom: "-8%",
    position: "absolute",
    zIndex: 1,
    right: "-1%",
  },
  imageTwo: {
    position: "absolute",
    height: "50%",
    width: "100%",
    left: "-5%",
    bottom: "5%",
    opacity: 1,
    zIndex: 4,
  },
  imagethree: {
    position: "absolute",
    height: 600,
    width: "100%",
    left: "30%",
    bottom: "1%",
    opacity: 0.8,
    zIndex: 0,
  },

  description: {
    fontSize: 18,
    padding: 20,
    alignSelf: "center",
    color: "#333",
  },
});
