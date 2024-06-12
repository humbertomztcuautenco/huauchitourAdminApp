import React,{useEffect,useMemo} from 'react';

// solucionar warnig
import {LogBox, View,ActivityIndicator,Text} from 'react-native';
// navegacion
import TabNavigation from './app/navigation/TabNavigation';
import StartStack from './app/navigation/StartStack';
// context
import {AuthContext} from './app/utils/context';
// base 64 error
import {encode,decode} from 'base-64';
// LogBox.ignoreAllLogs(true);
LogBox.ignoreLogs(["Setting a timer"]);
// storage
import * as SecureStore from 'expo-secure-store';
if (!global.btoa) global.btoa = encode;
if (!global.atob) global.atob = decode;

export default function App() {
  
  const initialLoginState = {
    isLogin : true,
    userToken: null,
    userName: null
  }

 // use reducer para estados de usuario

 const loginReducer = (prevState,action) => {
  switch (action.type) {
    // RECUPERAR TOKEN SI YA ESTA LOGUEADO
    case "RETRIVE_TOKEN":
      return (
        {
          ...prevState,
          userToken:action.token,
          isLogin:false,
        }
      )
    break;
    case "LOGIN":
      return (
        {
          ...prevState,
          userToken:action.token,
          userName:action.id,
          isLogin:false,
        }
      )
    break;
    case "LOGOUT":
      return (
        {
          ...prevState,
          userToken:null,
          userName:null,
          isLogin:false,
        }
      )
    break;
    case "REGISTER":
      return (
        {
          ...prevState,
          userToken:action.token,
          userName:action.id,
          isLogin:false,
        }
      )
    break;
  }
}

const [loginState,dispatch] = React.useReducer( loginReducer , initialLoginState );

const authContext = useMemo(() => ({
    sigin: async (userToken,user) => {
      await SecureStore.setItemAsync('userToken', userToken);
      dispatch({type:'LOGIN',id:user,token:userToken})
    },
    sigout: async () => {
      // setIsLogin(false);
      setUserToken(null);
      await SecureStore.deleteItemAsync('userToken'); 
      dispatch({type:'LOGOUT'})
    },
    sigup: () => {
      setIsLogin(false);
      setUserToken('1280398109');
    }
}));

useEffect(() => {
  setTimeout(async() => {
      // setIsLogin(false);
      let userToken = await SecureStore.getItemAsync('userToken');
      dispatch({type:'RETRIVE_TOKEN',token:userToken})
  }, 1000);
}, [])

if (loginState.isLogin) {
  return( 
    <View style = { { flex:1,justifyContent:'center',alignItems:'center' } } >
       <ActivityIndicator size={60} color="black" />
    </View>
   );  
}

return (
  <AuthContext.Provider value={authContext}>
    { loginState.userToken != null ?  <TabNavigation/>  :  <StartStack/> }
  </AuthContext.Provider>
);
}

