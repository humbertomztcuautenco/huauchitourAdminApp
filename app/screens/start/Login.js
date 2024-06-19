import React, { useState } from "react";
import { View, StyleSheet, Platform, Linking, ScrollView, Image, TextInput, TouchableOpacity, Modal } from "react-native";
import { Button, Input, Text, Icon } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Api from "../../utils/Api";
import Loader from "../../components/Loader";
import Constants from "expo-constants";
import { useDispatch } from "react-redux";
import { addUser, selectEstab } from "../../features/auth/authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Login({ navigation }) {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [verPassword, setVerPassword] = useState(false);
  const [data, setData] = useState({ user: "", password: "" });
  const [errors, setErrors] = useState({});
  const navegacion = useNavigation();

  const [modalVisible, setModalVisible] = useState(false);

  const handlePress = async () => {
    await Linking.openURL("mailto: correo@correo.com");
  };

  const guardarValor = (name, value) => {
    setData({ ...data, [name]: value });
  };

  const login = async () => {
    setErrors({});
    let valoresAceptados =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!data.password && !data.user) {
      setErrors({
        password: "Ingresa una contraseña",
        mail: "Ingresa un correo",
      });
    } else if (!data.password) {
      setErrors({ password: "Ingresa una contraseña" });
      if (!data.user.match(valoresAceptados)) {
        setErrors({
          password: "Ingresa una contraseña",
          mail: "Ingresa una dirección de correo válido",
        });
      }
    } else if (!data.user) {
      setErrors({ mail: "Ingresa un correo" });
    } else if (!data.user.match(valoresAceptados)) {
      setErrors({ mail: "Ingresa una dirección de correo válido" });
    } else {
      setIsLoading(true);
      let api = new Api(`auth/adminestab`, `POST`, data);
      await api.call().then(async (res) => {
        setTimeout(async () => {
          if (res.response) {
            setIsLoading(false);
            console.log("Login successful:", res.result);
            dispatch(
              addUser({
                token: res.result.token,
                user: res.result.id,
                estabs: res.result.estabs,
                id: res.result.id,
                estabSelect: null,
              })
            ).then(async () => {
              const storedToken = await AsyncStorage.getItem("token");
              console.log("Token stored in AsyncStorage:", storedToken);
            });

            if (res.result.estabs.length > 1) {
              navigation.navigate("listestabs");
            } else {
              dispatch(selectEstab({ estabSelect: res.result.estabs[0] }));
              navigation.navigate("home");
            }
          } else {
            setIsLoading(false);
            setErrors({ password: res.message });
          }
        }, 1);
      });
    }
  };

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      overScrollMode={"never"}
      keyboardShouldPersistTaps={"handled"}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <Image
        source={require("../../../assets/backLogin.jpg")}
        style={styles.imageBackground}
      />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.form}>
          <Image
            source={require("../../../assets/htlogo.png")}
            style={styles.imgForm}
          />
          <Text style={styles.welcomeText}>Bienvenido</Text>
          <TextInput style={styles.input} placeholder="Correo" onChangeText={(value) => guardarValor('user', value)} />
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            secureTextEntry={!verPassword}
            onChangeText={(value) => guardarValor('password', value)}
          />
          <View style={styles.textsContainer}>
            <Text style={styles.text}>Dudas o aclaraciones?</Text>
            <Text style={styles.text}>Contactanos:</Text>
            <TouchableOpacity>
              <Text style={styles.contactText} onPress={handlePress}>correo@correo.com</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.forgotPasswordText} onPress={() => navegacion.navigate("recoverpassword")}>
            ¿Olvidaste tu contraseña?
          </Text>
          <TouchableOpacity style={styles.button} onPress={login}>
            <Text style={styles.buttonText}>Entrar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Loader isVisible={isLoading} text='Validando Correo...' />

      <Modal
        animationType="fadeIn"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <View style={styles.modalIcon}></View>
            <Text style={styles.modalTitle}>Validando Correo...</Text>
          </View>
        </View>
      </Modal>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'ios' ? Constants.statusBarHeight : 0,
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageBackground: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  form: {
    justifyContent: "center",
    alignItems: "center",
    width: "80%",
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 40,
    padding: 20,
  },
  imgForm: {
    width: "40%",
    height: "18%",
  },
  welcomeText: {
    color: "white",
    fontSize: 35,
    fontWeight: "800",
    marginBottom: 30,
  },
  input: {
    backgroundColor: "white",
    width: "100%",
    borderRadius: 20,
    padding: 6,
    paddingLeft: 15,
    marginVertical: 10,
  },
  textsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 50,
  },
  text: {
    color: 'white',
    fontWeight: '500',
    fontSize: 17,
  },
  contactText: {
    fontSize: 17,
    fontWeight: "900",
    color: "white",
  },
  forgotPasswordText: {
    color: "white",
    fontSize: 17,
    fontWeight: "800",
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#08A1F0",
    borderRadius: 30,
    paddingHorizontal: 80,
    paddingVertical: 10,
    marginBottom: 50,
  },
  buttonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "600",
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: 'white',
    paddingVertical: 30,
    paddingHorizontal: 50,
    borderRadius: 20,
    alignItems: 'center',
  },
  modalIcon: {
    width: 80,
    height: 80,
    backgroundColor: "black",
  },
  modalTitle: {
    fontSize: 25,
  }
});