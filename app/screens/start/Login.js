import React,{useState} from 'react';
import {View,StyleSheet,ScrollView,Alert, Linking} from 'react-native';
import { Button,Input,Text,Icon} from 'react-native-elements';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
// stardust IMports

// import {AuthContext} from '../../utils/context';
import Api from '../../utils/Api';
import Loader from '../../components/Loader';
import Constants from 'expo-constants';

export default function Login({ navigation }) {
  // const navegacion = useNavigation();
  // loader
  const [isLoading, setIsLoading] = useState(false)
  // obtener info de password y user
  const [verPassword, setVerPassword] = useState(false);
  const [data, setData] = React.useState({
    user:"",
    password:""
  });
  const [errors, setErrors] = useState({});

  const navegacion = useNavigation();
  const handlePress = async () => {
    await Linking.openURL("mailto: correo@correo.com");
  }
  const gurdarValor = (name,value) => {
    setData({...data,[name]:value})
  }

  useFocusEffect(
    React.useCallback(()=>{
      if(Platform.OS == 'ios'){
        StatusBar.setBarStyle('dark-content');
      }
    }, [])
  );

  const login = async() => {

    setErrors({});
    let valoresAceptados = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if(!data.password && !data.user){
      setErrors({password: "Ingresa una contraseña", mail: "Ingresa un correo"});
    } else if(!data.password) {
      setErrors({password: "Ingresa una contraseña"});
      if(!data.user.match(valoresAceptados)) {
        setErrors({password: "Ingresa una contraseña", mail: "Ingresa una dirección de correo válido"});
      }
    } else if(!data.user) {
      setErrors({mail: "Ingresa un correo"});
    } else if(!data.user.match(valoresAceptados)) {
      setErrors({mail: "Ingresa una dirección de correo válido"});
    } else {
      setIsLoading(true);
      let api = new Api(`auth/adminestab`,`POST`,data);
        await api.call().then(res=>{
           setTimeout(() => {
            if (res.response) {
              setIsLoading(false);
              navigation.navigate('listestabs',{'token':res.result.token,'estabs':res.result.estabs,'id':res.result.id});
            } else {
              setIsLoading(false);
              setErrors({password: res.message})
            }
          },1)
      })
    }
  }

  return (
    <KeyboardAwareScrollView style={{height:'100%',backgroundColor:'#fff', paddingTop: Platform.OS == 'ios' ? Constants.statusBarHeight : 0}} overScrollMode={'never'} keyboardShouldPersistTaps={'handled'}>
      <View style={{width:'100%',height:'85%',backgroundColor:"#fff"}} >
        <Text style={{marginTop:90,marginLeft:19,fontWeight:'bold',fontSize:25}}allowFontScaling={false}>Hola bienvenido.</Text>
        <View style={{alignItems: 'center', justifyContent: 'center', marginTop:80}}>
          <Input
            placeholder="No. de teléfono o correo electrónico"
            onChangeText={(value)=>gurdarValor('user',value)}
            inputContainerStyle = {{borderBottomWidth:0,justifyContent:'center'}}
            style = {styles.inputStyle}
            containerStyle = {styles.inputContainer}
            errorMessage={errors.mail}
          />
          <Input
            placeholder="Contraseña"
            onChangeText={(value)=>gurdarValor('password',value)}
            inputContainerStyle = {{borderBottomWidth:0}}
            style = {styles.inputStyle}
            containerStyle = {styles.inputContainer}
            password={true}
            secureTextEntry={verPassword ? false : true}
            rightIcon={
                <Icon
                    type="font-awesome" 
                    name = {verPassword ? "eye-slash" : "eye"}
                    size={20}
                    iconStyle = {{color:"gray"}}
                    onPress={()=>setVerPassword(!verPassword)}
                />
            }
            errorMessage={errors.password}
          />
          <Text 
            allowFontScaling={false}
            style={{ 
              // right: -15,
              color: "rgba(151,158,181,1)", 
              fontSize: 17, 
              marginBottom: 10,
              textAlign: 'center'
              }}>¿Dudas o aclaraciones? Contactanos: 
            <Text allowFontScaling={false}
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
        <View style={{width: '100%'}}>
            <Text 
                style={{fontSize: 15,color: "black",textAlign:"center", fontWeight: 'bold', marginBottom: 20, marginTop: 10}} 
                onPress={()=>navegacion.navigate("recoverpassword")}
            >¿Olvidaste tu contraseña?</Text>
        </View>
        
      </View>
      <View style={{alignItems:'center', justifyContent:'center',marginTop:10}}>
        <Button
          title="Entra"
          titleStyle = {{fontSize:20}}
          buttonStyle={styles.btnEntrar}
          containerStyle = {styles.btnContainer}
          onPress={ () => login()}
        />
      </View>
      <Loader isVisible = {isLoading} text='Cargando ...' />
    </KeyboardAwareScrollView>
  );
}


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
      marginBottom:30
  },
  inputStyle:{
      justifyContent :'center',
      fontSize:18,
      marginBottom: 10,
      paddingTop: 10
  }
})
