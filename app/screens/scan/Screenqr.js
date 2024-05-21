import React, {useCallback,useState} from 'react'
import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity, ScrollView} from 'react-native'
import { Button ,Image,Icon} from "react-native-elements";
import { useFocusEffect } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';
import { Ionicons } from '@expo/vector-icons';

import Api from '../../utils/Api';

const Screenqr = (props) => {
    const {navigation, route} = props;
    const {data} = route.params;
    
    const [loading, setLoading] = useState(null);
    const [infoQr, setInfoQr] = useState(null);

    useFocusEffect(
        useCallback(() => {
            (async()=>{
                try {
                    let token = await SecureStore.getItemAsync('userToken');
                    let textJson = global.atob(token);
                    let infoUser = JSON.parse(textJson);

                    let code = global.atob(data);
                    let spliteado = code.split('-');
                    if (spliteado[0] == "Evento") {

                        let api = null;
                        let uri = "";

                        //comprobando si hay actividades
                        uri = `eventos/registrarActividadesCompletadas/${spliteado[2]}/${spliteado[1]}/${infoUser.data.idEstab}`;
                        api = new Api(uri, "POST");
                        api.call().then((res) => {
                          if(res.response){
                            api = new Api(`eventos/getToken/${spliteado[2]}`, 'GET');
                            api.call().then(res=>{
                                if(res.response){
                                    setInfoQr ({
                                        titulo1:"¡Fantastico!",
                                        titulo2: "QR de actividad valido.",
                                        color : "#e6078e",
                                        nombre: '',
                                        icon : "check-circle-o",
                                        valido : false,
                                        titlebutton : 'Regresar',
                                    });
                                    setLoading(true)
                                }else{
                                    setInfoQr ({
                                        titulo1:"¡Fantastico!",
                                        titulo2: "Se ha escaneado correctamente tu QR, lamentablemente no hemos podido comunicarnos con el dispositivo del cliente.",
                                        color : "#ff0003",
                                        nombre : '',
                                        icon : 'times-circle-o',
                                        valido: false,
                                        titlebutton : 'Regresar'
                                    });
                                    setLoading(true)
                                }
                            });
                          }else{
                            setInfoQr ({
                                titulo1:"Error al completar:",
                                titulo2: res.message,
                                color : "#ff0003",
                                nombre : '',
                                icon : 'times-circle-o',
                                valido: false,
                                titlebutton : 'Regresar'
                            });
                            setLoading(true)
                          }
                        });
                    } else if(spliteado[0] == "Premio"){
                        let spliteado2 = JSON.parse(spliteado[2]);
                        // reclamando premio
                        let uri = `eventos/reclamarPremio/${1}/${spliteado[1]}`;
                        let api = new Api(uri, "PUT");
                        api.call().then((res) => {
                            if (res.response) {
                                let infoPremio = {
                                    type: 1,
                                    id: spliteado[3],
                                    title: "¡Felicidades!",
                                    body: "Has reclamado tu premio de esta temporada",
                                    data: "PRDHT"
                                }
                                let uri2 = `eventos/sendIndiAndGlobalNotifications`;
                                let api2 = new Api(uri2, "POST", infoPremio);

                                api2.call().then((res)=>{
                                    if(res.response){
                                        setInfoQr ({
                                            titulo1:"¡Felicidades!",
                                            titulo2: "Has reclamado: " + spliteado2.titulo + ".\n\nEl premio consiste en: " + spliteado2.descripcion + ".",
                                            color : "#e6078e",
                                            nombre: '',
                                            icon : "check-circle-o",
                                            valido : false,
                                            titlebutton : 'Regresar',
                                        });
                                        setLoading(true)
                                    } else {
                                        setInfoQr ({
                                            titulo1:"¡Felicidades!",
                                            titulo2: "Has reclamado: " + spliteado2.titulo + ".\n\nEl premio consiste en: " + spliteado2.descripcion + ".\nLamentablemente no pudimos comunicarnos con el dispositivo del cliente.",
                                            color : "#e6078e",
                                            nombre: '',
                                            icon : "check-circle-o",
                                            valido : false,
                                            titlebutton : 'Regresar',
                                        });
                                        setLoading(true)
                                    }
                                })

                            } else {
                                setInfoQr ({
                                    titulo1:"¡Que mal!",
                                    titulo2: "Ha ocurrido un error al reclamar el premio. \n\n"+ res.message,
                                    color : "#ff0003",
                                    nombre : '',
                                    icon : 'times-circle-o',
                                    valido: false,
                                    titlebutton : 'Regresar'
                                });
                                setLoading(true)
                            }
                        });
                    } else {
                        let spliteado2 = code.split('-');
                        let token =  await SecureStore.getItemAsync('userToken');
                        let api = new Api(`scan/validateMembership/${spliteado2[1]}`,`GET`,null,token);
                        await api.call().then(res=>{
                            if (res.response) {
                                setInfoQr ({
                                    titulo1:"¡Fantastico!",
                                    titulo2: "QR valido.",
                                    color : "#8CCF30",
                                    nombre : res.result.nombre, 
                                    icon : "check-circle-o",
                                    valido : true,
                                    titlebutton : 'Ver promos',
                                    idPersona : res.result.id
                                });
                                setLoading(true)
                            } else {
                                res.result == 401 && sigout();
                                setInfoQr ({
                                    titulo1:"¡Qué mal!",
                                    titulo2: "QR vencido.",
                                    color : "#E7E7E7",
                                    nombre : '',
                                    icon : 'times-circle-o',
                                    valido: false,
                                    titlebutton : 'Regresar'
                                });
                                setLoading(true)
                            }
                        });
                        
                    }
                } catch (error) {
                    setInfoQr ({
                        titulo1:"!Que mal!",
                        titulo2: "QR invalido.",
                        color : "#E7E7E7",
                        nombre : '',
                        icon : 'times-circle-o',
                        valido: false,
                        titlebutton : 'Regresar'
                    });
                    setLoading(true)

                }
            })()
        },[])
    )
    
    return (
        (loading) ? (
            <View style ={{height:'100%',backgroundColor: '#fff', position: 'relative', paddingTop: Platform.OS == 'ios' ? Constants.statusBarHeight * 2.5 : Constants.statusBarHeight * 1.5}}>
                <View style={{height:'auto', marginLeft:15, marginRight:15, maxHeight: 350}} >
                    <Text style={{fontSize:30,fontWeight:'bold'}} allowFontScaling={false}>{infoQr.titulo1}</Text>
                    <Text style={{fontSize:20,fontWeight:'bold', textAlign: 'justify', marginTop: 10}} allowFontScaling={false}>{infoQr.titulo2}</Text>
                </View>
                <View style={{alignItems:'center', justifyContent:'center', height: 270, paddingTop: 10}}>
                    <View style={{height:'50%', backgroundColor:infoQr.color, height:180, width:180, alignItems: 'center', justifyContent: 'center', borderRadius:10}} >
                        <Image 
                            resizeMode = "cover"
                            source = {
                                require("../../../assets/frame.png")
                            }
                            style = {{height:150,width:150,borderRadius:10}}
                        />
                    </View>
                    <Icon
                        type="font-awesome" 
                        name = {infoQr.icon}
                        style ={{marginTop: 5, marginBottom: 5}}
                    />
                    <Text style={{fontSize:20,fontWeight:'bold'}} allowFontScaling={false}>{infoQr.nombre}</Text>
                </View>
                <View style={{height: 120, flexDirection: 'column', justifyContent: 'space-evenly', bottom: 10, position: 'absolute'}}>
                    <View style={{flexDirection:'row',marginLeft:15,marginRight:15,alignItems: 'center', justifyContent:'center',}}>
                        <Button title = {infoQr.titlebutton} containerStyle = {styles.btnContainer} buttonStyle ={styles.btnDescontar} 
                            onPress = { () => {
                                infoQr.valido ? navigation.navigate('listaPromos',{nombre:infoQr.nombre,idPersona:infoQr.idPersona}) : navigation.navigate('scan');
                            }} 
                        />
                    </View>
                    {infoQr.valido ? 
                    <View style={{flexDirection:'row',marginLeft:15,marginRight:15,alignItems: 'center', justifyContent:'center'}}>
                        <Button title = 'Regresar' containerStyle = {styles.btnContainer} buttonStyle ={styles.btnDescontar} 
                            onPress = { () => {navigation.navigate('scan') }} 
                        />
                    </View>
                    :
                    <View style={{display: 'none'}}></View>
                    }
                </View>
            </View>
        ):(
            <View style={{backgroundColor:'#fff',alignItems: 'center', justifyContent: 'center',height:'100%', paddingTop: Constants.statusBarHeight * 1.5}}>
                <ActivityIndicator size={50} color="black" />
            </View>
        )
    )
}

export default Screenqr

const styles = StyleSheet.create({
    btnContainer:{
        width:"100%",
        height:50,
        fontSize : 25,
    },
    btnDescontar : {
        borderRadius: 6,
        backgroundColor: "black",
        fontSize : 25,
        height:45
    },
})
