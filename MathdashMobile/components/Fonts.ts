import * as Font from "expo-font";
import { useEffect, useState } from "react";

const loadFonts = () => {
    const [fonts, loadedFonts] = useState(false);
  return Font.loadAsync({
    "Manrope-Bold": require("@/assets/fonts/Manrope/static/Manrope-Bold.ttf"),
    "Manrope-Light": require("@/assets/fonts/Manrope/static/Manrope-Light.ttf"),
    "Manrope-Regular": require("@/assets/fonts/Manrope/static/Manrope-Regular.ttf"),
    "Manrope-Medium": require("@/assets/fonts/Manrope/static/Manrope-Medium.ttf"),
  });

  useEffect(() => {
    loadFonts().then(() => loadedFonts(true))
  }, []);
};