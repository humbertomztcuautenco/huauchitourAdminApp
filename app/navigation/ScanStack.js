import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

import Scan from "../screens/scan/Scan";
import Screenqr from '../screens/scan/Screenqr';
import ScreeanListPromos from '../screens/scan/ScreeanListPromos';

const Stack = createNativeStackNavigator();

const  ScanStack = () => {
  return (
    // <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name= "scan" component={Scan}
          options={{
            title:"",
            headerStyle:{
              backgroundColor:'#fff',
              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 0,
              height: 30
            },
            headerShown: false
          }} 
        />
        <Stack.Screen name= "qr" component={Screenqr} 
          options={{
            title:"",
            headerStyle:{
              backgroundColor:'#fff',
              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 0
            },
            headerShown: false
          }} 
        />
        <Stack.Screen name= "listaPromos" component={ScreeanListPromos} 
          options={{
            title:"",
            headerStyle:{
              backgroundColor:'#fff',
              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 0
            },
            headerShown: false
          }}
        />
      </Stack.Navigator>
    // </NavigationContainer>
  );
}

export default ScanStack;