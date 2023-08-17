import { store } from "./src/redux/store";
import { Provider } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import UserHomepage from "./src/screens/user/UserHomepage";
import GoToSchool from "./src/screens/user/GoToSchool";
import OriginToSchoolMap from "./src/screens/user/OriginToSchoolMap";
import Searching from "./src/screens/user/Searching";
import BigMap from "./src/component/BigMap";

export default function App() {
  const Stack = createStackNavigator();
  return (
    <>
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Group>
              {/* <Stack.Screen name="UserHomepage" component={UserHomepage} /> */}
              {/* <Stack.Screen
                name="OriginToSchoolMap"
                component={OriginToSchoolMap}
              /> */}
              <Stack.Screen name="big" component={BigMap} />
              <Stack.Screen
                name="Searching"
                component={Searching}
                options={{ presentation: "fullScreenModal" }}
              />
            </Stack.Group>
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    </>
  );
}
