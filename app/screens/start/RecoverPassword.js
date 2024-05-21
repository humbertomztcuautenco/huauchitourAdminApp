import React from 'react'
import { StyleSheet, View, TouchableOpacity, Alert} from 'react-native'
import { Button, Input, Text} from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Ionicons } from '@expo/vector-icons';
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

    return (
        <View style={{width:'100%',height:'100%',backgroundColor:"#fff",   paddingTop: Platform.OS == 'ios' ? Constants.statusBarHeight : 0}}>
            <TouchableOpacity style={{margin: 15}} onPress={()=> navegacion.navigate('login')}>
                <Ionicons 
                    name="arrow-back"
                    size={40}
                />
            </TouchableOpacity>
            <KeyboardAwareScrollView style={{width:'100%',height:'100%',backgroundColor:"#fff"}} overScrollMode='never'   keyboardShouldPersistTaps='always'>
                <Text allowFontScaling={false} style={{marginTop:90,marginLeft:19,marginRight:20,   fontWeight:'bold',fontSize:25}}>Ingresa el correo con el que inicias sesión</Text>
                <View style={{alignItems: 'center', justifyContent: 'center', marginTop:80}}>
                    <Input
                        placeholder="Correo electronico"
                        onChangeText={(e) => saveValue("user", e)}
                        inputContainerStyle = {{borderBottomWidth:0}}
                        style = {styles.inputStyle}
                        containerStyle = {styles.inputContainer}
                        errorMessage={errors.message}
                    />
                </View>
                <View style={{alignItems:'center', justifyContent:'center',marginTop:10}}>
                    <Button
                        title="Enviar correo"
                        titleStyle = {{fontSize:20}}
                        buttonStyle={styles.btnEntrar}
                        containerStyle = {styles.btnContainer}
                        onPress={() => {
                            if(data.user != ""){ 
                              sendCode();
                            } else { 
                              setErrors({state:true, message: "Por favor ingresa un correo"})
                            }}}
                        />
                </View>
                <Text allowFontScaling={false} style={{marginHorizontal:10, alignSelf: 'center',    color:'grey', marginBottom: 30}}>Te enviaremos un correo con un código para verificar que     eres tú.</Text>
            </KeyboardAwareScrollView>
        </View>
    )
}

export default RecoverPassword

const styles = StyleSheet.create({
    estamosContentosDe:{
        color: "rgba(151,158,181,1)",
        fontSize: 16,
        letterSpacing: -0.4
    },
    btnContainer:{
        width:"90%",
        height:50,
        fontSize : 25,
        marginBottom: 20
    },
    btnEntrar : {
        borderRadius: 6,
        backgroundColor: "black",
        fontSize : 25,
        height:45
    },
    inputContainer : {
        width : "90%",
        height:55,
        borderWidth: 1,
        borderColor: "#fff",
        borderRadius: 6,
        backgroundColor: "#F0F0F0",
        marginBottom:40,
        paddingTop: 5
    },
    inputStyle:{
        // textAlign:"center",
        fontSize:18,
        marginBottom: 5
    }
  })