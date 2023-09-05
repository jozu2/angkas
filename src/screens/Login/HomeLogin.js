import { View, Text, StyleSheet, Pressable } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'

const HomeLogin = () => {
  const navigation = useNavigation()
  return (
    <View style={styles.container}>

      <Pressable style={styles.button}
                 onPress={() => navigation.navigate('StudentLogin')}>             
        <Text>Student</Text> 
      </Pressable>


      <Pressable style={styles.button}
                  onPress={() => navigation.navigate('DriverLogin')}> 
        <Text>Driver</Text>
      </Pressable>

    </View>
  )
}

export default HomeLogin



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
    marginBottom: 40,
  },
  input: {
    marginBottom: 12,
    padding: 8,
    borderWidth: 1,
    borderColor: "gray",
  },
});
