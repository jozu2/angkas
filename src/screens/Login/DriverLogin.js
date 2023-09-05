import { View, Text, Pressable, TextInput, StyleSheet } from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { firebase } from "./../../../config";

const DriverLogin = () => {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const navigation = useNavigation();

  loginUser = async (email, password) => {
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
    } catch (error) {
      alert(error.message);
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
        onPress={() => loginUser(email, password)}
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
