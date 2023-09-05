import "react-native-gesture-handler";
import { store } from "./src/redux/store";
import { Provider } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";

import AuthNavigator from "./src/navigations/AuthNavigator";
import UserNavigation from "./src/navigations/user";

export default function App() {
  return (
    <>
      <Provider store={store}>
        <NavigationContainer>
          <UserNavigation />
        </NavigationContainer>
      </Provider>
    </>
  );
}
