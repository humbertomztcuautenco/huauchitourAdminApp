import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

// import Cuenta from "../screens/cuenta/Cuenta";
import Login from '../screens/start/Login';
import RecoverPassword from '../screens/start/RecoverPassword';
import ListEstabs from '../screens/start/ListEstabs';
import WriteCode from '../screens/start/WriteCode';
import ChangePass from '../screens/start/ChangePass';

const Stack = createNativeStackNavigator();

const StartStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* <Stack.Screen name="cuentaInicio" component={Cuenta} options={{title:"Cuenta"}} /> */}
        <Stack.Screen
          name="login"
          component={Login}
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
        <Stack.Screen
          name="listestabs"
          component={ListEstabs}
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
        <Stack.Screen
          name="recoverpassword"
          component={RecoverPassword}
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
        <Stack.Screen
          name="writeCode"
          component={WriteCode}
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
        <Stack.Screen
          name="changePass"
          component={ChangePass}
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default StartStack;