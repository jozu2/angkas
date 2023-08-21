import { store } from "./src/redux/store";
import { Provider } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import UserHomepage from "./src/screens/user/UserHomepage";
import Searching from "./src/screens/user/Searching";
import UserGotoScoolMap from "./src/screens/user/UserGotoScoolMap";
import UserGotoHomeMap from "./src/screens/user/UserGotoHomeMap";
import SearchinSchoolToHomeRide from "./src/screens/user/SearchinSchoolToHomeRide";

export default function App() {
  const Stack = createStackNavigator();
  return (
    <>
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Group>
              <Stack.Screen name="UserHomepage" component={UserHomepage} />
              {/* <Stack.Screen
                name="OriginToSchoolMap"
                component={OriginToSchoolMap}
              /> */}
              <Stack.Screen
                name="UserGotoScoolMap"
                component={UserGotoScoolMap}
              />
              <Stack.Screen
                name="UserGotoHomeMap"
                component={UserGotoHomeMap}
              />
              <Stack.Screen
                name="Searching"
                component={Searching}
                options={{ presentation: "fullScreenModal" }}
              />
              <Stack.Screen
                name="SearchinSchoolToHomeRide"
                component={SearchinSchoolToHomeRide}
                options={{ presentation: "fullScreenModal" }}
              />
            </Stack.Group>
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    </>
  );
}
