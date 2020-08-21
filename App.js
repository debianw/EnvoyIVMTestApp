import React, { useEffect, useState } from "react";
import { WebView } from "react-native-webview";
import { Button, View, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Camera } from 'expo-camera';

//
function HomeScreen({ navigation, route }) {
  function lastDriverId() {
    if (route.params && route.params.driverId) {
      return `Previously verified driver ID: ${route.params.driverId}`;
    } else {
      return "";
    }
  }
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>EnvoyApp!</Text>
      <Button
        title="Verify Identity"
        onPress={() => navigation.navigate("IVM")}
      />
      <Text>{lastDriverId()}</Text>
    </View>
  );
}

//
function IVMScreen({ navigation }) {
  function changedURL(state) {
    if (state.url.indexOf("https://my-test-callback") != -1) {
      let driverId = state.url.split("driver_id=")[1];
      navigation.navigate("Home", { driverId });
      return false;
    }
    return true;
  }
  return (
    <View style={{ flex: 1 }}>
      <WebView
        onShouldStartLoadWithRequest={changedURL}
        mediaPlaybackRequiresUserAction={false}
        source={{
          uri:
            "https://ivm.digisure.tech/verify?id=5fbb8069d5&env=partner&redirect=https%3A%2F%2Fmy-test-callback&trigger_trustscore=false",
        }}
      />
    </View>
  );
}

//
const Stack = createStackNavigator();
function App() {
  const [hasPermission, setHasPermission] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="IVM" component={IVMScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
export default App;
