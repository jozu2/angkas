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
import { LinearGradient } from "expo-linear-gradient";
const { width, height } = Dimensions.get("screen");

const SlideItem = ({ item }) => {
  const translateYImage = new Animated.Value(40);
  const translateYImage2 = new Animated.Value(40);

  const translateYImage3 = new Animated.Value(40);

  const translateYImage4 = new Animated.Value(-50);
  const translateYImage5 = new Animated.Value(30);
  const translateYImagebird = new Animated.Value(-80);
  const translateYImageplane = new Animated.Value(230);

  const navigation = useNavigation();

  Animated.timing(translateYImage, {
    toValue: 0,
    duration: 1000,
    useNativeDriver: true,
    easing: Easing.easeInOut,
  }).start();
  Animated.timing(translateYImage2, {
    toValue: 0,
    duration: 1800,
    useNativeDriver: true,
    easing: Easing.easeInOut,
  }).start();

  Animated.timing(translateYImage3, {
    toValue: 0,
    duration: 1600,
    useNativeDriver: true,
    easing: Easing.easeInOut,
  }).start();

  Animated.timing(translateYImage4, {
    toValue: 0,
    duration: 1400,
    useNativeDriver: true,
    easing: Easing.easeInOut,
  }).start();
  Animated.timing(translateYImage5, {
    toValue: 0,
    duration: 1200,
    useNativeDriver: true,
    easing: Easing.easeInOut,
  }).start();
  Animated.timing(translateYImagebird, {
    toValue: 70,
    duration: 11200,
    useNativeDriver: true,
    easing: Easing.easeInOut,
  }).start();
  Animated.timing(translateYImageplane, {
    toValue: -400,
    duration: 22200,
    useNativeDriver: true,
    easing: Easing.easeInOut,
  }).start();
  return (
    <LinearGradient colors={item.colors} style={styles.container}>
      <Animatable.View
        animation={"fadeIn"}
        duration={1900}
        delay={100}
        style={styles.buttonTopMargin}
      >
        <Pressable
          style={styles.buttonContainer}
          onPress={() => navigation.navigate(item.uri)}
        >
          <Text style={styles.description}>{item.description}</Text>
        </Pressable>
      </Animatable.View>

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
                  translateX: translateYImage2,
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
                  translateY: translateYImage3,
                },
              ],
            },
          ]}
        />
        <Animated.Image
          source={item.img4}
          resizeMode="contain"
          style={[
            styles.imagefour,
            {
              transform: [
                {
                  translateX: translateYImage4,
                },
              ],
            },
          ]}
        />
        <Animated.Image
          source={item.img5}
          resizeMode="contain"
          style={[
            styles.imagefive,
            {
              transform: [
                {
                  translateY: translateYImage5,
                },
              ],
            },
          ]}
        />
        <Animated.Image
          source={require("../assets/birds1.gif")}
          resizeMode="contain"
          style={[
            styles.bird1,
            {
              transform: [
                {
                  translateX: translateYImagebird,
                },
              ],
            },
          ]}
        />
        <Animated.Image
          source={require("../assets/plane.png")}
          resizeMode="contain"
          style={[
            styles.imageplane,
            {
              transform: [
                {
                  translateX: translateYImageplane,
                },
              ],
            },
          ]}
        />
      </View>
    </LinearGradient>
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
    width: "130%",
    bottom: "-16%",
    position: "absolute",
    zIndex: 1,
    opacity: 0.9,

    right: "-1%",
  },
  imageTwo: {
    position: "absolute",
    height: "50%",
    width: "100%",
    left: "-5%",
    bottom: "-5%",
    opacity: 1,
    zIndex: 4,
  },
  imagethree: {
    position: "absolute",
    height: 600,
    width: "100%",
    left: "30%",
    bottom: "-10%",
    opacity: 0.8,
    zIndex: 0,
  },
  imagefour: {
    position: "absolute",
    height: 600,
    width: "100%",
    left: "30%",
    bottom: "-10%",
    opacity: 0.8,
    zIndex: 0,
  },
  imagefive: {
    height: 700,
    width: "130%",
    bottom: "-16%",
    position: "absolute",
    zIndex: -50,
    opacity: 0.9,

    left: "3%",
  },

  //////////////////////////////
  bird1: {
    width: 200,
    height: 200,
    position: "absolute",
    bottom: "25%",
    zIndex: 200,
  },
  imageplane: {
    width: 100,
    height: 200,
    position: "absolute",
    right: "1%",
    top: "10%",
  },

  description: {
    fontWeight: "bold",
    fontSize: 25,

    padding: 15,
    alignSelf: "center",
    color: "#333",
    paddingHorizontal: 40,
    zIndex: 100,
  },
  buttonContainer: {
    position: "absolute",
    borderWidth: 2,
    borderRadius: 30,
    borderTopColor: "white",
    borderRightColor: "#ababab",
    alignSelf: "center",
  },
  buttonTopMargin: {
    top: "35%",
    zIndex: 800,
  },
});
