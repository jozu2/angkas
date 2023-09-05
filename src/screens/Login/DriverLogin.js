import { View, Text, Pressable, TextInput, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { firebase } from "./../../../config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { setUserIsLoggedin } from "../../redux/navSlice";

const DriverLogin = () => {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const navigation = useNavigation();
  const dispatch = useDispatch();

  useEffect(() => {
    // Check if the user is already authenticated
    checkUserAuthentication();
  }, []);

  const checkUserAuthentication = async () => {
    try {
      const driver = await AsyncStorage.getItem("driver");
      if (driver) {
        navigation.navigate("DriverMain");
      }
    } catch (error) {
      console.error("Error checking user authentication:", error);
    }
  };

  const loginDriver = async (email, password) => {
    try {
      const userCredential = await firebase
        .auth()
        .signInWithEmailAndPassword(email, password);
      const user = userCredential.user;

      if (user.emailVerified) {
        const userDocs = await firebase
          .firestore()
          .collection("drivers")
          .doc(user.uid)
          .get();

        if (userDocs.exists) {
          dispatch(setUserIsLoggedin("driver"));

          await AsyncStorage.setItem("driver", JSON.stringify(user));
        } else {
          alert("Please log in your Driver Account");
        }
      } else {
        // Email is not verified, display an error message
        firebase.auth().currentUser.sendEmailVerification({
          handleCodeInApp: true,
          url: "https://angkas-9b800.firebaseapp.com",
        });

        alert("Please verify your email before proceeding.");
        await firebase.auth().signOut();
        // You can also sign out the user at this point if desired
        // await firebase.auth().signOut();
      }
    } catch {
      alert("Invalid Email/Password");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        defaultValue={email}
        autoCorrect={false}
        onChangeText={(email) => setEmail(email)}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        defaultValue={password}
        onChangeText={(pass) => setPassword(pass)}
        keyboardType="default"
        autoCorrect={false}
        secureTextEntry={true}
        autoCapitalize="none"
      />

      <Pressable onPress={() => navigation.navigate("DriverRegistration")}>
        <Text style={styles.register}>NO Driver Account? Register</Text>
      </Pressable>

      <Pressable
        style={styles.button}
        onPress={() => loginDriver(email, password)}
        disabled={!email || !password}
      >
        <Text>Sign In</Text>
      </Pressable>
    </View>
  );
};

export default DriverLogin;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#1da",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    top: 30,
    padding: 10,
  },
  input: {
    marginBottom: 12,
    padding: 8,
    borderWidth: 1,
    borderColor: "gray",
  },
});
