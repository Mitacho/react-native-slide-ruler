import { StatusBar } from "expo-status-bar";
import { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

const { width } = Dimensions.get("screen");

const minAge = 0;
const segmentsLength = 91;
const segmentWidth = 2;
const indicatorWidth = 100;
const indicatorHeight = 80;
const segmentSpacing = 20;
const spacerWidth = (width - segmentWidth) / 2;
const snapSegment = segmentWidth + segmentSpacing;
const rulerWidth = spacerWidth * 2 + (segmentsLength - 1) * snapSegment;
const data = [...Array(segmentsLength).keys()].map((i) => i + minAge);

const Ruler = () => {
  return (
    <View style={styles.ruler}>
      <View style={styles.spacer} />
      {data.map((i) => {
        const tenth = i % 10 === 0;

        return (
          <View
            key={i}
            style={[
              styles.segment,
              {
                backgroundColor: tenth ? "#333" : "#999",
                height: tenth ? 40 : 20,
                marginRight: i === data.length - 1 ? 0 : segmentSpacing,
              },
            ]}
          />
        );
      })}
      <View style={styles.spacer} />
    </View>
  );
};

export default function App() {
  const scrollViewRef = useRef<ScrollView | null>(null);
  const textInputRef = useRef<TextInput | null>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const initialAge = useRef(25).current;

  scrollX.addListener(({ value }) => {
    if (textInputRef && textInputRef.current) {
      textInputRef.current.setNativeProps({
        text: `${Math.round(value / snapSegment) + minAge}`,
      });
    }
  });

  useEffect(() => {
    if (scrollViewRef && scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        x: (initialAge - minAge) * snapSegment,
        y: 0,
        animated: true,
      });
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Image source={require("./assets/cake.gif")} style={styles.cake} />
      <Animated.ScrollView
        ref={scrollViewRef}
        horizontal
        contentContainerStyle={styles.scrollViewContainerStyle}
        bounces={false}
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        snapToInterval={snapSegment}
        onScroll={Animated.event(
          [
            {
              nativeEvent: {
                contentOffset: { x: scrollX },
              },
            },
          ],
          {
            useNativeDriver: false,
          }
        )}
      >
        <Ruler />
      </Animated.ScrollView>
      <View style={styles.indicatorWrapper}>
        <TextInput
          ref={textInputRef}
          style={styles.ageTextStyle}
          defaultValue={minAge.toString()}
        />
        <View style={[styles.segment, styles.segmentIndicator]} />
      </View>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  segmentIndicator: {
    height: indicatorHeight,
    backgroundColor: "turquoise",
  },
  indicatorWrapper: {
    position: "absolute",
    left: (width - indicatorWidth) / 2,
    bottom: 40,
    alignItems: "center",
    justifyContent: "center",
    width: indicatorWidth,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    position: "relative",
  },
  cake: {
    width,
    height: width * 1.2,
    resizeMode: "cover",
  },
  ruler: {
    width: rulerWidth,
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "row",
  },
  segment: {
    width: segmentWidth,
  },
  scrollViewContainerStyle: {
    justifyContent: "flex-end",
  },
  ageTextStyle: {
    fontSize: 42,
  },
  spacer: {
    width: spacerWidth,
    backgroundColor: "red",
  },
});
