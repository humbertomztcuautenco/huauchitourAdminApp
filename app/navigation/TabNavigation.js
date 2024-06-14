import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {Icon} from 'react-native-elements';

import HomeStack from "./HomeStack";
import AccountStack from "./AccountStack";
import ScanStack from './ScanStack';

const Tab = createBottomTabNavigator();

export default function iNavigation() {
  return (
    <NavigationContainer>
      <Tab.Navigator 
        initialRouteName="restaurantes"
        screenOptions={({route})=>({
          tabBarIcon: ({color}) => iconos(route,color),
          tabBarInactiveTintColor:"#CFCFCF",
          tabBarActiveTintColor: "black",
          headerShown: false
        })}
      >
          <Tab.Screen 
            name="home" 
            options={{title:"Home"}} 
            component={HomeStack}
            
          />
          <Tab.Screen name="scan" options={{title:"Scan"}} component={ScanStack}/>
          <Tab.Screen name="account" options={{title:"Cuenta"}} component={AccountStack}/>
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const iconos = (route,color) => {
  let iconNombre;
  switch (route.name){
    case "home":
        iconNombre = "home"
      break;
    case "scan":
        iconNombre = "qrcode"
      break;
    case "account":
        iconNombre = "user"
      break;
  }
  
  return(
    <Icon type="font-awesome" name = {iconNombre} size={25} color={color} />
  )
}