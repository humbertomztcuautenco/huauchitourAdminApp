import * as React from 'react';
import { SafeAreaView, StyleSheet, Text, View, ScrollView, Platform, TouchableOpacity, Alert } from 'react-native';
import { Button, Input, Icon } from 'react-native-elements';
import { useNavigation, useFocusEffect} from '@react-navigation/native';
import Api from '../../utils/Api';
import Constants from 'expo-constants';
import { Ionicons } from '@expo/vector-icons';

export default function ChangePass(props) {
  const navigation = useNavigation();
  const[verPassword, setVerPassword] = React.useState(false);

  const [data, setData] = React.useState({
    pass: ""
  });

  const [errors, setErrors] = React.useState({
    state: false,
    message: ""
  })
  const saveValue = (name,value) => {
      setData({...data,[name]:value})
  }

  const savePass = async () => {
    if(data.pass.length <= 5){
        setErrors({state:true, message: "Ingresa una contraseña de mínimo 6 caracteres"})
    }
    let uri = "";
    let api = null;

    let params = {
      password: data.pass,
    }

    uri = `user/updatePassword/${props.route.params.user}`;
    api = new Api(uri,'PUT', params, props.route.params.token);
    api.call().then(res => {
      if (res.response) {
        navigation.navigate("login")
        setErrors({state:false, message: ""})
      } else {
        setErrors({state:true, message: res.errors})
      }
    });
  }

  const back = () => {
    Alert.alert(
      "Atención",
      "Si regresas tendrás que hacer el proceso de cambio de contraseña nuevamente.",
      [
        {
          text: "Regresar",
          onPress: async () => {
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
      <ScrollView overScrollMode='never' keyboardShouldPersistTaps='handled' style={{ backgroundColor: "#fff", height: "100%", width: '100%'}}>
        <View style={{ margin: 20, }}>
          <Text style={{ fontSize: 27, textAlign: 'left', fontWeight: 'bold', marginBottom: 20}} allowFontScaling={false}>
            Cambio de contraseña.</Text>
          <Text style={{fontSize:17, color: 'gray',}} allowFontScaling={false}>
            Por favor ingresa tu nueva contraseña, recuerda que una vez realizada esta acción no podrá revertirse.{"\n"}
            {"\n"}Una vez tu contraseña haya sido cambiada seras redirigido automáticamente a la pantalla de inicio de sesión para que puedas iniciar sesión con tu nueva contraseña.
          </Text>


        </View>

        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Input
            allowFontScaling={false}
            placeholder='Contraseña'
            style={styles.inputStyle}
            selectionColor={'#3D5CA4'}
            containerStyle={styles.inputContainer}
            inputContainerStyle={{ borderBottomWidth: 0 }}
            onChangeText={(e) => saveValue("pass", e)}
            maxLength={50}
            password={true}
            secureTextEntry={verPassword ? false : true}
            keyboardType="default"
            errorMessage={errors.message}
            rightIcon={
                <Icon
                    type="font-awesome" 
                    name = {verPassword ? "eye-slash" : "eye"}
                    size={20}
                    iconStyle = {{color:"gray"}}
                    onPress={()=>setVerPassword(!verPassword)}
                />
            }
          />
        </View>

        <View style={{ justifyContent: 'center', alignContent: 'center', paddingTop: '7%', marginBottom: 50 }}>
          <Button
            containerStyle={styles.containerBtn}
            buttonStyle={styles.btnStyle}
            title="Confirmar"
            titleStyle={{ fontSize: 21, letterSpacing: -0.5750000000000001}}
            onPress={() => {
              if(data.pass != ""){ 
                savePass();
              } else { 
                setErrors({state:true, message: "Por favor, ingresa una contraseña"})
              }}}
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
    marginBottom: 30,
    borderRadius: 6,
  },
})