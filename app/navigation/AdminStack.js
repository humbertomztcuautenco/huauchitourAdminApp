import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

// import Cuenta from "../screens/cuenta/Cuenta";
import AdminHome from '../screens/admin/AdminHome'

const Stack = createNativeStackNavigator();

const AdminStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="adminHome"
          component={AdminHome}
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

export default AdminStack;