import React,{ useState, useCallback, useRef }from 'react'
import { StyleSheet, View, ActivityIndicator, Alert, Dimensions, TouchableOpacity, ScrollView, Platform } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import {Button, Avatar, Text, Input, Icon} from 'react-native-elements';
import * as SecureStore from 'expo-secure-store';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import moment from 'moment';
import Modal from "react-native-modal";
import Constants from 'expo-constants';

import {AuthContext} from '../../utils/context';
import Loader from '../../components/Loader';
import Api from '../../utils/Api';

const Account = () => {
    const  {sigout} = React.useContext(AuthContext);
    const [infoUser, setInfoUser] = useState(null);
    const [numDescuentos, setNumDescuentos] = useState(null);

    const [visible, setVisible] = React.useState(false);
    const navigation = useNavigation();

    const[moment2, setMoment2] = useState("validation");
    const[verPassword, setVerPassword] = useState(false);
    const [data, setData] = React.useState({
        user:"",
        password:""
    });
    const message = useRef("");

    const gurdarValor = (name,value) => {
        setData({...data,[name]:value})
    }
      
    useFocusEffect(
        useCallback(() => {
            ( async()=>{
                let fecha = moment().format('yyyy-MM-DD')
                let token = await SecureStore.getItemAsync('userToken');
                let textJson = global.atob(token);
                let infoUser = JSON.parse(textJson);
                setInfoUser(infoUser.data);
                let api = new Api(`promotion/count/${infoUser.data.idEstab}/${fecha}`,`GET`,null,token);
                await api.call()
                .then(res=>{
                    if (res.response) {
                        setNumDescuentos(res.result)
                    } else {
                        res.result == 401 && sigout();
                    }
                });
            })()
        },[])
    )
    const closeSession = () => {
        Alert.alert(
            "Cerrar sesion.",
            "Esta seguro cerrar sesión?",
            [
                {
                    text:"Cancelar",
                    style: "cancel"
                },
                { 
                    text: "Aceptar", 
                    onPress: () => {
                        sigout();
                    } 
                }
            ],
            {
                cancelable:false
            }
        )
    }
    
    //Confirmación para poder eliminar cuenta.
    const confirmarContra = async()=>{
        let uri = "";
        let api = null;

        uri = `auth/checkPassword/${infoUser.idPersona}/${data.password}`;
        api = new Api(uri,'GET');
        await api.call().then(res => {
            if(res.response){
                Alert.alert(
                    "Eliminar cuenta.",
                    "¿Estás seguro de querer eliminar tu cuenta?. Esta es una acción permanente, así que tómatelo con calma",
                    [
                        {
                            text:"Cancelar",
                            style: "cancel"
                        },
                        { 
                            text: "Aceptar", 
                            onPress: async () => {
                                uri = `auth/removalRequest/${infoUser.idPersona}`;
                                api = new Api(uri,'POST');
                                await api.call().then(res => {
                                    if(res.response){
                                        message.current = res.message;
                                        setMoment2('message');
                                    }else{
                                        alert(res.message);
                                    }
                                })
                            } 
                        }
                    ],
                    {
                        cancelable:false
                    }
                )
            }else{
                if (data.password == "" || data.password == null) {
                    alert("Contraseña incorrecta");
                } else {
                    alert(res.message);
                }
            }
        })
    }

     //funcion para abrir y cerrar el popup
    const abrirCerrar = () => {
      if(visible){
        setVisible(false);
      }else{
        setVisible(true)
      }
    }

    return (
        !infoUser ? (
            <Loader/>
        ) : (

            <View style={styles.ViewAccount}>
                
                <View style={{height:'25%',alignItems:'center', justifyContent:'center'}}>
            
                    {/* <Image
                        resizeMode = "cover"
                        source = {
                            infoUser.UrlFoto
                            ? { uri: infoUser.UrlFoto }
                            : require("../../../assets/no-image.png")
                        }
                        style = {{height:120,width:100}}
                    /> */}
                    <Avatar
                        rounded
                        resizeMode = "cover"
                        source = {
                            infoUser.urlImg
                            ? { uri: infoUser.urlImg }
                            : require("../../../assets/no-image.png")
                        }
                        size="large"
                    />
                    <Text style={{fontSize:25,marginTop:10,fontWeight:'bold'}} allowFontScaling={false}>{infoUser.NombreEstab}</Text>
                </View>
                <View style={{height:'50%',justifyContent:'center',marginLeft:15, marginTop: 50}}>
                    <KeyboardAwareScrollView>
                    <Text style={styles.textGrey} allowFontScaling={false}>Correo electrónico</Text>
                    <Text style={styles.textBlack} allowFontScaling={false}>{infoUser.Correo}</Text>
                    <Text style={styles.textGrey} allowFontScaling={false}>Teléfono</Text>
                    <Text style={styles.textBlack} allowFontScaling={false}>{infoUser.Telefono}</Text>
                    <Text style={styles.textGrey} allowFontScaling={false}>Descuento de hoy</Text>
                    <Text style={styles.textBlack} allowFontScaling={false}>{numDescuentos ? numDescuentos : <ActivityIndicator size={27} color="black"/>}</Text>
                    <Text onPress = {()=>navigation.navigate("listaPromosUsadas")} style={[styles.textBlack, {color: '#e6078e'}]}allowFontScaling={false}>Ver promos aplicadas hoy</Text>
                    </KeyboardAwareScrollView>
                </View>

                <View style={{flexDirection:'row', height:'10%',marginLeft:15,marginRight:15,alignItems: 'center', justifyContent:'center', bottom:20}} >
                    <Button containerStyle={styles.containerBtn} buttonStyle = {styles.btnLoguot} title="Cerrar sesion" onPress={() => closeSession() }/>
                </View>
                <View style={{justifyContent:'center', alignItems:'center', height:'5%', bottom:20}}>
                    <Text onPress={() => abrirCerrar()} style={[styles.textGrey,{fontSize:17, color:'grey'}]} allowFontScaling={false}>Eliminar cuenta</Text>
                </View>
                
                <Modal
                    isVisible={visible}
                    animationIn={"slideInRight"}
                    animationInTiming={700}
                    animationOut={"slideOutRight"}
                    animationOutTiming={700}
                    onBackdropPress={abrirCerrar}
                    backdropTransitionInTiming={1000}
                    deviceHeight={Dimensions.get("window").height}
                    deviceWidth={Dimensions.get("window").width}
                    backdropOpacity={.5}
                    
                >
                    <View style={styles.eliminarCuentaC}>

                        <ScrollView style={styles.scroll} overScrollMode="never" KeyboardShouldPersisTaps={"hundled"} contentContainerStyle={{height: '100%'}}>
                        {
                            moment2 == "validation" ?
                            <View style={styles.datosC}>

                                    <Text style={{fontSize:30, fontWeight:'bold', textAlign:'center', marginBottom:10, marginTop: "10%"}} allowFontScaling={false}> Eliminar cuenta</Text>

                                    <Text style={{fontWeight:'bold',fontSize:18, marginBottom:10, textAlign:'center'}} allowFontScaling={false}>Por favor, introduce tu contraseña.</Text>

                                    <Text style={{fontSize:12, color:'grey', margin:20, marginBottom:20, textAlign:'center'}} allowFontScaling={false}>Recuerda que una vez terminado el proceso tu cuenta sera eliminada de manera permanente. </Text>

                                    <Input 
                                        placeholder="Contraseña"
                                        onChangeText={(value)=>gurdarValor('password', value)}
                                        inputContainerStyle = {{borderBottomWidth:0, paddingBottom:0}}
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
                                    />
                                    <Button
                                        title="Eliminar"
                                        titleStyle = {{fontSize:20}}
                                        buttonStyle={styles.btnSiguiente}
                                        containerStyle = {styles.btnContainer}
                                        onPress={() => confirmarContra()}
                                    />   
                                    <Button
                                        title="Cancelar"
                                        titleStyle = {{fontSize:20}}
                                        buttonStyle={styles.btnCancelar}
                                        containerStyle = {styles.btnContainer2}
                                        onPress={ () => {abrirCerrar(), setVerPassword(false)}}
                                    />   
                                </View>
                                :
                                <View style={styles.datosC}>
                                    <Text style={{fontSize:20,  textAlign:'justify', marginBottom:10, marginTop: "15%"}} allowFontScaling={false}>{message.current}</Text>

                                    <Button
                                        title="Entendido"
                                        titleStyle = {{fontSize:20}}
                                        buttonStyle={styles.btnAceptar}
                                        containerStyle = {styles.btnContainer3}
                                        onPress={() => {
                                            abrirCerrar();
                                            sigout();
                                        }}
                                    />
                                </View>
                        }
                        </ScrollView>
                    </View>

                </Modal>
      
            </View>
        )
    )
}

export default Account

const styles = StyleSheet.create({
    ViewAccount: {
        width:'100%',
        height:'100%',
        backgroundColor:'#fff',
        flexDirection:'column',
        paddingTop: Platform.OS == 'ios' ? Constants.statusBarHeight : 0
    },
    btnLoguot:{
        borderRadius: 6,
        backgroundColor: "black",
        fontSize : 25,
        height:45
    },
    containerBtn:{
        width:"100%",
        height: 50,
        fontSize : 25,
        position:'absolute',
        bottom:3
    },
    textGrey:{
        color:'grey',
        fontSize:20
    },
    textBlack:{
        fontWeight:'bold',
        marginBottom: 20,
        fontSize:20
    },
    eliminarCuentaC:{
        height: "110%",
        width: "111%",
        alignSelf: "center",
        backgroundColor: "#fff",
        flexDirection: "column",
        alignItems: "center",
        justifyContent:'center',
        position:'relative'
    },
    scroll: {
        width: "100%",
        padding: "5%",
    },
    datosC:{
        width: "100%",
        height: Dimensions.get("window").height,
        flexDirection: "column",
        alignItems:'center'

    },
    inputContainer : {
        width : "90%",
        height: 50,
        borderWidth: 1,
        borderColor: "#fff",
        borderRadius: 6,
        backgroundColor: "#F0F0F0",
        marginBottom:10

    },
    inputStyle:{
        // textAlign:"center",
        height:50,
        justifyContent :'center',
        fontSize:18,
        textAlignVertical:'center'
    },
    btnContainer:{
        width:"90%",
        height:50,
        fontSize : 25,
        marginTop:10,
    },
    btnSiguiente:{
        borderRadius: 6,
        backgroundColor: "red",
        fontSize : 25,
        height:50,
    },
    btnContainer2:{
        width:"90%",
        height:50,
        fontSize : 25,
        marginTop:10,
        marginBottom:10
    },
    btnCancelar:{
        borderRadius: 6,
        backgroundColor: "black",
        fontSize : 25,
        height:50
    },
    btnContainer3:{
        width:"90%",
        height:50,
        fontSize : 25,
        marginTop:20,
        marginBottom:10
    },
    btnAceptar:{
        borderRadius: 6,
        backgroundColor: "black",
        fontSize : 25,
        height:50
    },

})
