import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CameraPhoto from "./CameraPhoto";
import Home from "./Home";
import { NavigationContainer } from "@react-navigation/native";



export default function Navigation(){
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator >
        <Stack.Screen
          name="Home"
          component={Home}

        />
        <Stack.Screen name="CameraPhoto" component={CameraPhoto} />
      </Stack.Navigator>
    </NavigationContainer>

  );
}
