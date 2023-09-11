import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import * as Animatable from "react-native-animatable";

const HomeLogin = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.Main}>
      <View style={styles.containerone}>
        <Animatable.View
          animation="fadeInDown"
          duration={1900}
          delay={100}
          iterationCount={1}
          style={styles.logoContainer}
        >
          <Image
            source={require("../../assets/logo.png")}
            style={styles.logo}
          />
        </Animatable.View>
        <Animatable.Text
          animation="fadeIn"
          duration={1900}
          delay={100}
          iterationCount={1}
          style={styles.logoTitle}
        >
          Angkas Atad
        </Animatable.Text>
      </View>
      <Animatable.View
        animation={"fadeInUp"}
        duration={1900}
        delay={100}
        iterationCount={1}
        style={styles.containertwo}
      >
        <Animatable.View
          animation={"slideInUp"}
          duration={1900}
          delay={100}
          iterationCount={1}
        >
          <Text style={styles.h1}>Login As</Text>
          <Pressable
            style={[styles.button, { marginTop: "5%" }]}
            onPress={() => navigation.navigate("StudentLogin")}
          >
            <Text style={styles.buttonText}>RIDER</Text>
          </Pressable>

          <Pressable
            style={[styles.button, { backgroundColor: "#9c3932" }]}
            onPress={() => navigation.navigate("DriverLogin")}
          >
            <Text style={styles.buttonTexttwo}>DRIVER</Text>
          </Pressable>
        </Animatable.View>
      </Animatable.View>
    </View>
  );
};

export default HomeLogin;

const styles = StyleSheet.create({
  containerone: {
    backgroundColor: "#4f0a05",

    height: "47%",

    justifyContent: "center",
  },
  Main: {
    flex: 1,
    backgroundColor: "#4f0a05",
  },
  buttonText: {
    fontSize: 17,
    color: "black",
    letterSpacing: 1.1,
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowRadius: 1,
  },
  buttonTexttwo: {
    fontSize: 17,
    color: "white",
    letterSpacing: 1.1,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 1,
  },

  button: {
    width: "80%",
    height: 50,
    alignSelf: "center",
    backgroundColor: "white",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    top: 2,
    padding: 10,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: "gray",
  },
  input: {
    marginBottom: 12,
    padding: 8,
    borderWidth: 1,

    borderColor: "gray",
  },
  h1: {
    fontSize: 30,
    color: "black",
    letterSpacing: 0.5,
    alignSelf: "center",
    textShadowColor: "rgba(0, 0, 0, 0.55)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
    marginTop: "25%",
  },
  containertwo: {
    position: "absolute",
    width: "95%",
    alignSelf: "center",
    height: "50%",
    bottom: "10%",
    borderRadius: 30,
    backgroundColor: "white",
  },
  logo: {
    resizeMode: "cover",
    height: 130,
    width: 230,
    alignSelf: "center",
  },
  logoContainer: {
    backgroundColor: "#4f0a05",
    borderRadius: 1000,
    width: "40%",
    height: "25%",
    alignSelf: "center",
    justifyContent: "center",
  },
  logoTitle: {
    alignSelf: "center",
    fontSize: 30,
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
});
