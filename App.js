
import React from "react";

import {
  StyleSheet,
} from 'react-native'

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ViewHomePage from "./AppInternals/Views/ViewHomePage";
import ViewAppBlock from "./AppInternals/Views/ViewAppBlock";
import ViewToDoDashboard from "./AppInternals/Views/ViewToDoDashboard";

const Stack = createNativeStackNavigator(); // creates navigation object

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator  /* container holding pages / screens*/
       screenOptions={{ /* apply these styles to all screens inside navigator */
        headerTransparent: true,
        headerStyle: styles.screenOptHeader,
        headerTitleStyle: styles.headerTitle,
       }}
      >
        <Stack.Screen name="Home" component={ViewHomePage} />  
        <Stack.Screen 
          name="AppBlock" 
          component={ViewAppBlock} 
            options={{
              headerTitle: "",
              headerBackVisible: true,
            }}
          /> 

       {/* Todo screen view */}
        <Stack.Screen 
          name="ToDo" 
          component={ViewToDoDashboard} 
            options={{
              headerTitle: "",
              headerBackVisible: false,
            }}
        /> 

      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "transparent",
  }
});
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