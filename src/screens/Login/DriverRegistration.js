import { View, Text, Pressable, TextInput, StyleSheet } from "react-native";
import React, { useState } from "react";
import { firebase } from "./../../../config";
import { useNavigation } from "@react-navigation/native";

const DriverRegistration = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [studentId, setStudentId] = useState("");
  const navigation = useNavigation();

  resgisterDriver = async (email, password, firstName, lastName, studentId) => {
    await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        firebase
          .auth()
          .currentUser.sendEmailVerification({
            handleCodeInApp: true,
            url: "https://angkas-9b800.firebaseapp.com",
          })
          .then(() => {
            alert("Verification Email Sent");
          })
          .catch((err) => {
            alert(err.message);
          })
          .then(() => {
            firebase
              .firestore()
              .collection("drivers")
              .doc(firebase.auth().currentUser.uid)
              .set({
                firstName,
                lastName,
                email,
                studentId,
              });
          })
          .catch((err) => {
            alert(err.message);
          });
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        defaultValue={firstName}
        onChangeText={(fname) => setFirstName(fname)}
        placeholder="First Name"
        autoCorrect={false}
        placeholderTextColor="grey"
        returnKeyType="next"
      />

      <TextInput
        style={styles.input}
        defaultValue={lastName}
        onChangeText={(lname) => setLastName(lname)}
        placeholder="Last Name"
        autoCorrect={false}
        placeholderTextColor="grey"
        returnKeyType="next"
      />

      <TextInput
        style={styles.input}
        defaultValue={studentId}
        onChangeText={(studID) => setStudentId(studID)}
        placeholder="Student ID"
        autoCorrect={false}
        placeholderTextColor="grey"
        returnKeyType="next"
      />

      <TextInput
        style={styles.input}
        defaultValue={email}
        onChangeText={(email) => setEmail(email)}
        textContentType="emailAddress"
        placeholder="Email Address"
        autoCapitalize="none"
        placeholderTextColor="grey"
        keyboardType="email-address"
        returnKeyType="next"
      />

      <TextInput
        style={styles.input}
        defaultValue={password}
        onChangeText={(pass) => setPassword(pass)}
        placeholder="Enter Password"
        placeholderTextColor="grey"
        returnKeyType="next"
        secureTextEntry={true}
        textContentType="password"
        keyboardType="default"
      />

      <Pressable
        style={styles.registerContainer}
        onPress={() => navigation.navigate("HomeLogin")}
      >
        <Text style={styles.register}>want to sign in?</Text>
      </Pressable>

      <Pressable
        style={styles.button}
        onPress={() =>
          resgisterDriver(email, password, firstName, lastName, studentId)
        }
      >
        <Text>SIGN UP</Text>
      </Pressable>
    </View>
  );
};

export default DriverRegistration;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  hiddenInput: {
    width: 0,
    height: 0,
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
