import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { ExperienceHome } from "./src/presentation/ExperienceHome";

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <ExperienceHome />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F5F0',
  },
});
