import { randomPuzzle } from "@/constants/randomPuzzle";
import * as Font from "expo-font";
import React, { Key } from "react";
import { StyleSheet, Text, View } from "react-native";

const loadFonts = () => {
  return Font.loadAsync({
    "Manrope-Bold": require("@/assets/fonts/Manrope/static/Manrope-Bold.ttf"),
    "Manrope-Light": require("@/assets/fonts/Manrope/static/Manrope-Light.ttf"),
    "Manrope-Regular": require("@/assets/fonts/Manrope/static/Manrope-Regular.ttf"),
    "Manrope-Medium": require("@/assets/fonts/Manrope/static/Manrope-Medium.ttf"),
  });
};


const Puzzles = () => {
    return (
        <>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>PUZZLES</Text>
                </View>
                <View style={styles.line}></View>
                <View style={styles.puzzleDisplay}>
                    {randomPuzzle.map((item: any, index: Key) => (
                        <View key={index}>
                            <Text style={styles.problem}>{item.problem}</Text>
                        </View>
                    ))}
                </View>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "black",
    },
    header: {
        justifyContent: "center",
        alignContent: "center"
    },
    headerText: {
        color: "white",
        fontFamily: "Manrope-Bold",
        justifyContent: "center",
        alignContent: "center"
    },
    line: {
        backgroundColor: "white",
        width: "100%",
        height: "1%",
        marginTop: "10%",
        marginBottom: "10%"
    },
    puzzleDisplay: {
        textAlign: "center",
        justifyContent: "flex-start",
        borderRadius: 15,
        borderCurve: "continuous",
    },
    problem: {
        textAlign: "center",
        fontFamily: "Manrope-Regular",
        fontSize: 15,
    }
})

export default Puzzles;