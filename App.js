import "react-native-gesture-handler";
import { store } from "./src/redux/store";
import { Provider } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";

import UserNavigation from "./src/navigations/user";
import SideMenu from "./src/navigations/sideMenu";
import MainNavUser from "./src/navigations/MainNavUser";

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
