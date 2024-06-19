import React, { useState } from 'react';
import { View, StyleSheet, Platform, Linking } from 'react-native';
import { Button, Input, Text, Icon } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Api from '../../utils/Api';
import Loader from '../../components/Loader';
import Constants from 'expo-constants';
import { useDispatch } from 'react-redux';
import { addUser, selectEstab } from '../../features/auth/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Login({ navigation }) {

  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [verPassword, setVerPassword] = useState(false);
  const [data, setData] = useState({ user: "", password: "" });
  const [errors, setErrors] = useState({});
  const navegacion = useNavigation();

  const handlePress = async () => {
    await Linking.openURL("mailto: correo@correo.com");
  }

  const guardarValor = (name, value) => {
    setData({ ...data, [name]: value });
  }

  const login = async () => {
    setErrors({});
    let valoresAceptados = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!data.password && !data.user) {
      setErrors({ password: "Ingresa una contraseña", mail: "Ingresa un correo" });
    } else if (!data.password) {
      setErrors({ password: "Ingresa una contraseña" });
      if (!data.user.match(valoresAceptados)) {
        setErrors({ password: "Ingresa una contraseña", mail: "Ingresa una dirección de correo válido" });
      }
    } else if (!data.user) {
      setErrors({ mail: "Ingresa un correo" });
    } else if (!data.user.match(valoresAceptados)) {
      setErrors({ mail: "Ingresa una dirección de correo válido" });
    } else {
      setIsLoading(true);
      let api = new Api(`auth/adminestab`, `POST`, data);
      await api.call().then(async res => {
        setTimeout(async () => {
          if (res.response) {
            setIsLoading(false);
            console.log('Login successful:', res.result);
            dispatch(addUser({
              token: res.result.token,
              user: res.result.id,
              estabs: res.result.estabs,
              id: res.result.id,
              estabSelect: null,
            })).then(async () => {
              const storedToken = await AsyncStorage.getItem('token');
              console.log('Token stored in AsyncStorage:', storedToken);
            });

            if (res.result.estabs.length > 1) {
   
              navigation.navigate('listestabs');
            } else {
              dispatch(selectEstab({ estabSelect: res.result.estabs[0] }));
              navigation.navigate('home');
            }

          } else {
            setIsLoading(false);
            setErrors({ password: res.message });
          }
        }, 1)
      })
    }
  }

  return (
    <KeyboardAwareScrollView style={{ height: '100%', backgroundColor: '#fff', paddingTop: Platform.OS == 'ios' ? Constants.statusBarHeight : 0 }} overScrollMode={'never'} keyboardShouldPersistTaps={'handled'}>
      <View style={{ width: '100%', height: '85%', backgroundColor: "#fff" }} >
        <Text style={{ marginTop: 90, marginLeft: 19, fontWeight: 'bold', fontSize: 25 }} allowFontScaling={false}>Hola bienvenido.</Text>
        <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 80 }}>
          <Input
            placeholder="No. de teléfono o correo electrónico"
            onChangeText={(value) => guardarValor('user', value)}
            inputContainerStyle={{ borderBottomWidth: 0, justifyContent: 'center' }}
            style={styles.inputStyle}
            containerStyle={styles.inputContainer}
            errorMessage={errors.mail}
          />
          <Input
            placeholder="Contraseña"
            onChangeText={(value) => guardarValor('password', value)}
            inputContainerStyle={{ borderBottomWidth: 0 }}
            style={styles.inputStyle}
            containerStyle={styles.inputContainer}
            password={true}
            secureTextEntry={!verPassword}
            rightIcon={
              <Icon
                type="font-awesome"
                name={verPassword ? "eye-slash" : "eye"}
                size={20}
                iconStyle={{ color: "gray" }}
                onPress={() => setVerPassword(!verPassword)}
              />
            }
            errorMessage={errors.password}
          />
          <Text
            allowFontScaling={false}
            style={{
              color: "rgba(151,158,181,1)",
              fontSize: 17,
              marginBottom: 10,
              textAlign: 'center'
            }}>¿Dudas o aclaraciones? Contactanos:
            <Text
              allowFontScaling={false}
              style={{
                fontSize: 19,
                fontWeight: 'bold',
                textDecorationLine: 'underline',
              }}
              onPress={() => handlePress()}>
              correo@correo.com
            </Text>
          </Text>
        </View>
        <View style={{ width: '100%' }}>
          <Text
            style={{ fontSize: 15, color: "black", textAlign: "center", fontWeight: 'bold', marginBottom: 20, marginTop: 10 }}
            onPress={() => navegacion.navigate("recoverpassword")}
          >¿Olvidaste tu contraseña?</Text>
        </View>

      </View>
      <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 10 }}>
        <Button
          title="Entra"
          titleStyle={{ fontSize: 20 }}
          buttonStyle={styles.btnEntrar}
          containerStyle={styles.btnContainer}
          onPress={() => login()}
        />
      </View>
      <Loader isVisible={isLoading} text='Cargando ...' />
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  estamosContentosDe: {
    color: "rgba(151,158,181,1)",
    fontSize: 16,
    letterSpacing: -0.4
  },
  btnContainer: {
    width: "90%",
    height: 50,
    fontSize: 25,
    marginBottom: 20
  },
  btnEntrar: {
    borderRadius: 6,
    backgroundColor: "black",
    fontSize: 25,
    height: 45
  },
  inputContainer: {
    width: "90%",
    height: 55,
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 6,
    backgroundColor: "#F0F0F0",
    marginBottom: 30
  },
  inputStyle: {
    justifyContent: 'center',
    fontSize: 18,
    marginBottom: 10,
    paddingTop: 10
  }
});
