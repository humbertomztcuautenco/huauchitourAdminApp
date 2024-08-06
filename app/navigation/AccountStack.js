import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

//import Account from "../screens/account/Account";
import AccountNewVersion from '../screens/account/AccountNewVersion';
import ListPromosUse from '../screens/account/ListPromosUse';
import SellMembership from '../screens/home/SellMembership';
const Stack = createNativeStackNavigator();

const AccountStack = () => {
  return (
    // <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="account" component={AccountNewVersion}
        options={{
          title: "",
          headerStyle: {
            backgroundColor: '#fff',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0
          },
          headerShown: false
        }}
      />
      <Stack.Screen name="listaPromosUsadas" component={ListPromosUse}
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
      <Stack.Screen name="venderMembresias" component={SellMembership}
        options={{
          title: "Vender Membresias",
          headerStyle: {
            backgroundColor: '#fff',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0
          },
          headerShown: false,

        }}

      />
    </Stack.Navigator>
    // </NavigationContainer>
  );
}

export default AccountStack;