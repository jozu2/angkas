import { StyleSheet, Animated, View, Dimensions } from "react-native";
import React from "react";

const { width } = Dimensions.get("screen");

const Pagination = ({ data, scrollX, index }) => {
  return (
    <View style={styles.container}>
      {data.map((_, idx) => {
        const inputRange = [(idx - 1) * width, idx * width, (idx + 1) * width];

        const dotWidth = scrollX.interpolate({
          inputRange,
          outputRange: [100, 250, 100],
          extrapolate: "clamp",
        });

        const opacity = scrollX.interpolate({
          inputRange,
          outputRange: [0.2, 1, 0.1],
          extrapolate: "clamp",
        });

        const backgroundColor = scrollX.interpolate({
          inputRange,
          outputRange: ["#171717", "#dedede", "#171717"],
          extrapolate: "clamp",
        });

        return (
          <Animated.View
            key={idx.toString()}
            style={[
              styles.dot,
              { width: dotWidth, backgroundColor },
              // idx === index && styles.dotActive,
            ]}
          />
        );
      })}
    </View>
  );
};

export default Pagination;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 15,
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  dot: {
    width: 100,
    height: 5,
    borderRadius: 6,
    marginHorizontal: 5,
    backgroundColor: "#ccc",
  },
  dotActive: {
    backgroundColor: "white",
  },
});
