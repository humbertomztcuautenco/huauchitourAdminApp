import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

// import Cuenta from "../screens/cuenta/Cuenta";
import SelectEstab from '../screens/home/SelectEstab'

const Stack = createNativeStackNavigator();

const SelectStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="selectEstab"
          component={SelectEstab}
          options={{
            title: "",
            headerStyle: {
              backgroundColor: '#fff',
              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 0
            },
            headerShown: false,
            animation: 'slide_from_right'
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default SelectStack;