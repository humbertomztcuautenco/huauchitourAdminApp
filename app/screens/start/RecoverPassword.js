import React from 'react'
import { StyleSheet, View, TouchableOpacity, Alert, Platform,  TextInput, Text, Image, ScrollView, Modal} from 'react-native'
import { Button, Input} from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import Api from '../../utils/Api';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { getValueFor, deleteValue } from '../../utils/localStorage';

const RecoverPassword = () => {
    const navegacion = useNavigation();

    const [data, setData] = React.useState({
        user:""
    });
    const [errors, setErrors] = React.useState({
      state: false,
      message: ""
    })

    const saveValue = (name,value) => {
        setData({...data,[name]:value})
    }

    useFocusEffect(
      React.useCallback(()=>{
        const getval =  async () => {
          let soli = await getValueFor("soli");
          let fecha = await getValueFor("fechaSoli");
          fecha = JSON.parse(fecha);
          fecha = new Date(fecha);
          let fechaA = new Date();
          if(soli && fecha){
            fecha.setDate(fecha.getDate() + 1)
            if(fechaA < fecha){
              Alert.alert(
                "Atención",
                "Recientemente solicitaste un código para cambiar tu contraseña.\n¿Deseas usar ese código?\nDe lo contrario, puedes solicitar uno nuevo ingresando tu correo nuevamente.",
                [
                  {
                    text: "Solicitar uno nuevo",
                    onPress: async () => {
                      await deleteValue("soli");
                      await deleteValue("fechaSoli");
                    }
                  },
                  {
                    text: "Usar mi código",
                    onPress: async () => {
                      navegacion.navigate("writeCode", {"user": soli})
                    }
                  }
                ]
              );
            }
          }
        }
        getval();
      },[])
    );

    const sendCode = async () => {
      console.log('hi')
      let valores = data.user;
      let valoresAceptados = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if(!valores.match(valoresAceptados)){
        setErrors({state:true, message: "Ingresa una dirección de correo válido."});
      } else {
        let fechaB = await getValueFor("fechaBloq");
        const send = () => {
          let uri = "";
          let api = null;
      
          let params = {
            correo: data.user,
            tipoPersona: 2
          }
      
          uri = `auth/sendCodeEmail`;
          api = new Api(uri,'POST', params);
          api.call().then(res => {
            if (res.response) {
              navegacion.navigate("writeCode", data); 
              setErrors({state:false, message: ""})
            } else {
              setErrors({state:true, message: res.errors})
            }
          });
        }

        if(fechaB){
          let fecha = new Date();
          fechaB = JSON.parse(fechaB);
          fechaB = new Date(fechaB);
          if(fecha > fechaB){
            send();
          }else{
            alert("Has exedido el numero de intentos permitidos para enviar correos, espera 10 minutos para poder enviar correo de recuperación nuevamente."); 
          }
        }else{
          send();
        }
      }
    }

    const goBack = () =>{
      navegacion.navigate("login")
    }

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
          <TouchableOpacity style={styles.iconContainer} onPress={goBack}>
            <FontAwesome name='arrow-left' size={20} color='black' />
          </TouchableOpacity>
            <Image
              source={require("../../../assets/htlogo.png")}
              style={styles.imgForm}
            />
            <Text style={styles.welcomeText}>¿Olvidaste tu contraseña?</Text>

            <View style={styles.textsContainer}>
              <Text style={styles.text}>Ingresa el correo con el que inicias sesion</Text>
            </View>
            <Input 
              style={styles.input} 
              inputContainerStyle={{borderBottomWidth:0}} 
              placeholder="Correo" 
              errorMessage={errors.message} 
              onChangeText={(e) => saveValue("user",e)} 
            />
            
            <TouchableOpacity 
              style={styles.button} 
              onPress={() => {
                if(data.user != ""){ 
                  sendCode();
                } else { 
                  setErrors({state:true, message: "Por favor ingresa un correo"})
                }}}>
              <Text style={styles.buttonText}>Enviar correo</Text>
            </TouchableOpacity>

            <Text style={styles.forgotPasswordText}>Te enviaremos un correo con un codigo para verificar que eres tu</Text>

          </View>

        </ScrollView>
  
        {/* <Loader isVisible={isLoading} text='Validando Correo...' /> */}
  
        {/* <Modal
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
        </Modal> */}
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
      width: "39%",
      height: "20%",
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
      marginBottom:20
    },
    textsContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom:20
    },
    text: {
      color: 'white',
      fontSize: 20,
      textAlign:'center'
    },
    contactText: {
      fontSize: 17,
      fontWeight: "900",
      color: "white",
    },
    forgotPasswordText: {
      color: "gray",
      fontSize: 17,
      marginBottom: 30,
      textAlign:'center',
      marginTop:20
    },
    button: {
      backgroundColor: "#08A1F0",
      borderRadius: 30,
      paddingHorizontal: 80,
      paddingVertical: 15,
    },
    buttonText: {
      color: "white",
      fontSize: 17,
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
    },
    iconContainer:{
      backgroundColor:'white',
      position:'absolute',
      top:20,
      left:20,
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
      borderRadius:40,
      padding:10
    }
  });

  export default RecoverPassword
