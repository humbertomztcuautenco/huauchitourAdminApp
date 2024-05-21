import * as React from 'react';
import { SafeAreaView, StyleSheet, Text, View, ScrollView, StatusBar, TouchableOpacity, Alert} from 'react-native';
import { Button, Input } from 'react-native-elements';
import { useNavigation, useFocusEffect} from '@react-navigation/native';
import Api from '../../utils/Api';
import Constants from 'expo-constants';
import { Ionicons } from '@expo/vector-icons';
import { saveValue, deleteValue, getValueFor } from '../../utils/localStorage';

export default function WriteCode(props) {
  const navigation = useNavigation();

  const [data, setData] = React.useState({
    code: ""
  });
  const corr = React.useRef(props.route.params);
  const [count, setCount] = React.useState(120);

  const [errors, setErrors] = React.useState({
    state: false,
    message: ""
  })
  const saveValu = (name,value) => {
      setData({...data,[name]:value})
  }

  useFocusEffect(
    React.useCallback(()=>{
      // guardar info sobre solicitud de codigo
      const savval =  async () => {
        let soli = await getValueFor("soli");
        let fecha2 = await getValueFor("fechaSoli");
        let intentos = await getValueFor("intentos");
        let fechaBloqueo = await getValueFor("fechaBloq");

        if(intentos && !soli && !fecha2){
          intentos = JSON.parse(intentos);
          await saveValue("intentos", JSON.stringify(intentos + 1));
          if(intentos >= 5){
            let fecha = new Date();
            fecha.setMinutes(fecha.getMinutes() + 10);
            fecha = JSON.stringify(fecha);
            await saveValue("fechaBloq", fecha);
            deleteValue("intentos");
          }
        }

        if(fechaBloqueo){
          fechaBloqueo = JSON.parse(fechaBloqueo);
          fechaBloqueo = new Date(fechaBloqueo);
          let fecha = new Date();
          if(fecha > fechaBloqueo){
            await saveValue("intentos", JSON.stringify(1));
            deleteValue("fechaBloq");
          }
        }

        if(!soli && !fecha2){
          let fecha = new Date();
          fecha = JSON.stringify(fecha);
          let value = corr.current.user;
          await saveValue("soli", value);
          await saveValue("fechaSoli", fecha);
        }

        if(!intentos && !fechaBloqueo){
          await saveValue("intentos", JSON.stringify(1));
        }
      }
      savval();
    },[])
  );

  // iniciar cuenta regresiva para volvera a enviar correo
  const regresiva = () => {
    const timer = setInterval(() => {
      setCount(prevCount => {
        if (prevCount === 0) {
          clearInterval(timer);
          return "Reenviar código";
        } else {
          return prevCount - 1;
        }
      });
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }

  //ejecuta la cuenta regresiva cuando se ingresa a la pantalla
  React.useEffect(() => {
    regresiva();
  }, []);

  // verifica que el codigo escrito sea valido
  const validateCode = async () => {
    let uri = "";
    let api = null;

    let params = {
      codigo: data.code,
      tipoPersona: 2
    }

    let correo = corr.current.user;

    uri = `auth/validateCodeEmail/${correo}`;
    api = new Api(uri,'POST', params);
    api.call().then(res => {
      if (res.response) {
        deleteValue("soli");
        deleteValue("fechaSoli");
        deleteValue("intentos");
        navigation.navigate("changePass", {token: res.result, user: correo})
        setErrors({state:false, message: ""})
      } else {
        setErrors({state:true, message: res.errors})
      }
    });
  }

  // envia un codigo por correo si aun no se exeden lso 5 intentos
  const sendCode = async () => {
    let intentos = await getValueFor("intentos");
    let fechaBloqueo = await getValueFor("fechaBloq");

    if( intentos && intentos < 5 ){

      intentos = JSON.parse(intentos);
      await saveValue("intentos", JSON.stringify(intentos + 1));

      setCount(120);
      regresiva();

      let uri = "";
      let api = null;

      let params = {
        correo: corr.current.user,
        tipoPersona: 2
      }

      uri = `auth/sendCodeEmail`;
      api = new Api(uri,'POST', params);
      api.call().then(async res => {
        if (res.response) {
          alert("Se ha enviado un nuevo código a tu correo.");
          setErrors({state:false, message: ""})
        } else {
          setErrors({state:true, message: res.errors})
        }
      });
    }else{
      alert("Has exedido el numero de intentos permitidos para enviar correos, espera 10 minutos para poder enviar correo de recuperación nuevamente."); 
      if(!fechaBloqueo){
        let fecha = new Date();
        fecha.setMinutes(fecha.getMinutes() + 10);
        fecha = JSON.stringify(fecha);
        await saveValue("fechaBloq", fecha);
        deleteValue("intentos");
      }else{
        fechaBloqueo = JSON.parse(fechaBloqueo);
        fechaBloqueo = new Date(fechaBloqueo);
        let fecha = new Date();
        if(fecha > fechaBloqueo){
          await saveValue("intentos", JSON.stringify(1));
          deleteValue("fechaBloq");
        }
      }
    }
  }


  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // regresa a la pantalla anterior
  const back = () => {
    Alert.alert(
      "Atención",
      "Si regresas ya no podrás usar el código que solicitaste.",
      [
        {
          text: "Regresar",
          onPress: async () => {
            await deleteValue("soli");
            await deleteValue("fechaSoli");
            navigation.navigate('recoverpassword');
          }
        },
        {
          text: "Cancelar"
        }
      ]
    );
  }

  return (
      <View style={{ backgroundColor: "#fff", height: "100%", width: '100%', paddingTop: Platform.OS == 'ios' ? Constants.statusBarHeight : 0}}>
        <TouchableOpacity style={{margin: 15}} onPress={()=> back()}>
          <Ionicons 
              name="arrow-back"
              size={40}
          />
        </TouchableOpacity>
        <ScrollView overScrollMode='never' keyboardShouldPersistTaps={'handled'} style={{ backgroundColor: "#fff", height: "100%", width: '100%'}}>
          <View style={{ margin: 20, }}>
            <Text style={{ fontSize: 27, textAlign: 'left', fontWeight: 'bold', marginBottom: 20}} allowFontScaling={false}>
              Confirmación de código.</Text>
            <Text style={{fontSize:17 , color: 'gray',}} allowFontScaling={false}>
              Por favor ingresa el código que fue enviado al correo:{"\n\n"}
              <Text style={{fontWeight: "bold", color: 'black'}} allowFontScaling={false}>
                {props.route.params.user}
              </Text>
              {"\n\n"}Si el código no ha sido recibido en un lapso de 2 minutos, puedes solicitar uno nuevo volviendo a la pantalla anterior.
            </Text>


          </View>

          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Input
              allowFontScaling={false}
              placeholder='Código'
              style={styles.inputStyle}
              selectionColor={'#3D5CA4'}
              containerStyle={styles.inputContainer}
              inputContainerStyle={{ borderBottomWidth: 0 }}
              onChangeText={(e) => saveValu("code", e)}
              maxLength={6}
              keyboardType="number-pad"
              errorMessage={errors.message}
            />
          </View>

          <View style={{ justifyContent: 'center', alignContent: 'center', paddingTop: '7%', marginBottom: 10 }}>
            <Button
              containerStyle={styles.containerBtn}
              buttonStyle={styles.btnStyle}
              title="Siguiente"
              titleStyle={{ fontSize: 21, letterSpacing: -0.5750000000000001 }}
              onPress={() => {
                if(data.code != ""){ 
                  validateCode();
                } else { 
                  setErrors({state:true, message: "Por favor ingresa un código"})
                }}}
            />
          </View>
              
          <View style={{ justifyContent: 'center', alignContent: 'center', paddingTop: '7%', marginBottom: 50 }}>
            <Button
              containerStyle={styles.containerBtn}
              buttonStyle={styles.btnStyle}
              title={ typeof count == "string" ? count : formatTime(count)}
              titleStyle={{ fontSize: 21, letterSpacing: -0.5750000000000001}}
              onPress={() => {
                sendCode()
              }}
              disabled={ typeof count != "string" ? true : false}
            />
          </View>
            
        </ScrollView>
      </View>
  )
}

const styles = StyleSheet.create({
  containerBtn: {
    paddingLeft: '5%'
  },
  btnStyle: {
    width: "95%",
    height: 55,
    borderRadius: 6,
    backgroundColor: "#000",
   
  },

  inputStyle: {
    textAlign: "center",
    fontSize: 18,
    marginBottom: 5
  },
  inputContainer: {
    width: "89%",
    height: 49,
    borderWidth: 1,
    borderColor: "rgba(151,151,151,1)",
    marginBottom: 20,
    borderRadius: 6,
  },
})