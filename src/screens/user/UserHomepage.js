import {
  Pressable,
  Image,
  StyleSheet,
  Text,
  View,
  FlatList,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import tw from "twrnc";
import React from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import SlideItem from "../../component/SlideItem";
import Pagination from "../../component/Pagination";
import Slides from "../../data/index";
import { useRef } from "react";
import { useState } from "react";
import { Animated } from "react-native";
import { setUserProfile } from "../../redux/navSlice";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
const UserHomepage = () => {
  const navigation = useNavigation();
  const [index, setIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const dispatch = useDispatch();
  const handleOnScroll = (event) => {
    Animated.event(
      [
        {
          nativeEvent: {
            contentOffset: {
              x: scrollX,
            },
          },
        },
      ],
      {
        useNativeDriver: false,
      }
    )(event);
  };

  const handleOnViewableItemsChanged = useRef(({ viewableItems }) => {
    setIndex(viewableItems[0].index);
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  useEffect(() => {
    (async () => {
      const userFirestore = await AsyncStorage.getItem("userInfo");

      const userFirestoreData = JSON.parse(userFirestore);
      dispatch(setUserProfile(userFirestoreData));
    })();
  }, []);

  return (
    // <>
    //   <View style={([tw`h-1/2 pt-10`], { backgroundColor: "white" })}>
    //     <Ionicons
    //       onPress={() => navigation.openDrawer()}
    //       name="menu-outline"
    //       size={52}
    //       color="white"
    //       style={styles.hamburger}
    //     />
    //     <Image
    //       source={require("../../assets/bgSchool.png")}
    //       style={styles.logo}
    //     />
    //     <Pressable
    //       style={styles.buttonOne}
    //       onPress={() => {
    //         navigation.navigate("UserGotoScoolMap");
    //       }}
    //     >
    //       <Text style={{ alignSelf: "center", fontSize: 20 }}>
    //         Go to School
    //       </Text>
    //     </Pressable>
    //   </View>

    //   <View style={[tw`h-1/2`, { backgroundColor: "white" }]}>
    //     <Image
    //       source={require("../../assets/bgHome.png")}
    //       style={styles.logo}
    //     />
    //     <Pressable
    //       style={styles.buttonOne}
    //       onPress={() => {
    //         navigation.navigate("UserGotoHomeMap");
    //       }}
    //     >
    //       <Text style={{ alignSelf: "center", color: "white", fontSize: 20 }}>
    //         Go Home
    //       </Text>
    //     </Pressable>
    //   </View>
    // </>
    <>
      <Ionicons
        onPress={() => navigation.openDrawer()}
        name="menu-outline"
        size={52}
        color="white"
        style={styles.hamburger}
      />
      <View style={styles.container}>
        <FlatList
          data={Slides}
          renderItem={({ item }) => <SlideItem item={item} />}
          horizontal
          pagingEnabled
          snapToAlignment="center"
          showsHorizontalScrollIndicator={false}
          onScroll={handleOnScroll}
          onViewableItemsChanged={handleOnViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
        />
        <Pagination data={Slides} scrollX={scrollX} index={index} />
      </View>
    </>
  );
};

export default UserHomepage;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
  },
  hamburger: {
    position: "absolute",
    left: "3%",
    top: "8%",
    zIndex: 1000,
  },
  logo: {
    resizeMode: "contain",
    width: "100%",
    height: "100%",
  },
  buttonOne: {
    backgroundColor: "rgba(225,225,225,0.8)",
    paddingHorizontal: 80,
    paddingVertical: 20,
    borderRadius: 30,
    position: "absolute",
    alignSelf: "center",
    bottom: "20%",
  },
});
