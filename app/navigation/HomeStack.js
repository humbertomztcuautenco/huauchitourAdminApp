import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

import Home from "../screens/home/Home";

const Stack = createNativeStackNavigator();

const  HomeStack = () => {
  return (
    // /<NavigationContainer>/
      <Stack.Navigator>
        <Stack.Screen 
          name= "home" 
          component={Home} 
          options={{
            title:"",
            headerStyle:{
              backgroundColor:'#fff',
              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 0
            },
            headerShown: false
          }} />
      </Stack.Navigator>
    // </NavigationContainer>
  );
}

export default HomeStack;