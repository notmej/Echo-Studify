import React from "react";

import {
  StyleSheet,
} from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ViewHomePage from "./AppInternals/Views/ViewHomePage";
import ViewAppBlock from "./AppInternals/Views/ViewAppBlock";
import ViewToDoDashboard from "./AppInternals/Views/ViewToDoDashboard";
import ViewStatisticsDashboard from "./AppInternals/Views/ViewStatisticsDashboard";

const Stack = createNativeStackNavigator(); // creates navigation object

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerTransparent: true,
          headerStyle: styles.screenOptHeader,
          headerTitleStyle: styles.headerTitle,
        }}
      >
        <Stack.Screen
          name="Home"
          component={ViewHomePage}
          options={{
            headerTitle: "",
            headerBackVisible: true,
          }}
        />

        <Stack.Screen
          name="AppBlock"
          component={ViewAppBlock}
          options={{
            headerTitle: "",
            headerBackVisible: true,
          }}
        />

        <Stack.Screen
          name="ToDo"
          component={ViewToDoDashboard}
          options={{
            headerTitle: "",
            headerBackVisible: false,
          }}
        />

        <Stack.Screen
          name="Stats"
          component={ViewStatisticsDashboard}
          options={{
            headerTitle: "",
            headerBackVisible: true,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  screenOptHeader: {
    backgroundColor: "transparent",
  },

  headerTitle: {
    color: "#2D2521",
    fontWeight: "700",
  },
});


//- - - - - - - OLD MANUAL TESTING - - - - - - - - -
// import React from 'react';
// import ViewHomePage from './AppInternals/Views/ViewHomePage';

// export default function App() {
//   return <ViewHomePage />;
// }


// // //uncomment to see To-DO Dashboard View
// // import ViewToDoDashboard from './AppInternals/Views/ViewToDoDashboard';

// // export default function App() {
// //   return <ViewToDoDashboard />;
// // }

// // import ViewAppBlock from './AppInternals/Views/ViewAppBlock';

// // export default function App() {
// //   return <ViewAppBlock />;
// // }