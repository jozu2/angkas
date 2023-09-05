import "react-native-gesture-handler";
import { store } from "./src/redux/store";
import { Provider } from "react-redux";
import { NavigationContainer, useNavigation } from "@react-navigation/native";

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
