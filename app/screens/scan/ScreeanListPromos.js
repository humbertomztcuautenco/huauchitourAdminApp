import React, {useCallback,useState} from 'react'
import { StyleSheet, Text, View, ActivityIndicator,Alert, TouchableOpacity} from 'react-native'
import {Image,Button} from 'react-native-elements';
import { useFocusEffect } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';
import Api from '../../utils/Api';
import ListPromos from '../../components/scan/ListPromos';
import Loader from '../../components/Loader';

const ScreeanListPromos = (props) => {
    const {navigation, route} = props;
    const {nombre,idPersona} = route.params;
    const [promos, setPromos] = useState(null)
    const [promoSelect, setPromoSelect] = useState(false)
    // const [infoUser, setInfoUser] = useState(null)
    const [isVisible, setIsVisible] = useState(false)
    const [token, setToken] = useState(null)
    useFocusEffect(
        useCallback(() => {
            (async()=>{
                let token = await SecureStore.getItemAsync('userToken');
                setToken(token);
                let textJson = global.atob(token);
                let infoUser = JSON.parse(textJson);
                // setInfoUser(infoUser);
                let api = new Api(`promotion/list/${infoUser.data.idEstab}`,`GET`,null,token);
                await api.call()
                .then(res=>{
                    if (res.response) {
                        // console.log(res.result);
                        setPromos(res.result)
                    } else {
                        res.result == 401 && sigout();
                    }
                });
            })()
        },[])
    )

    const addEscan = () => {
        promoSelect ? (
            Alert.alert(
                "Aplicar promoción",
                "¿Estás seguro de aplicar esta promoción?",
                [
                    {
                        text:"Cancelar",
                        style: "cancel"
                    },
                    { 
                        text: "Aceptar", 
                        onPress: () => {
                            apiScan();
                        } 
                    }
                ],
                {
                    cancelable:false
                }
            )
        )
        :(
            Alert.alert(
                "Atención",
                "Selecciona una promoción",
                [
                    {
                        text:"Aceptar",
                        style: "cancel"
                    }
                ],
                {
                    cancelable:false
                }
            ))
    }

    const apiScan  = async() => {
        setIsVisible(true);
        console.log(idPersona);
        let parametros = {
            "idPromocion":promoSelect,
            "idPersona":idPersona
        };

        let api = new Api(`scan/addScan`,`POST`,parametros,token);
        await api.call()
        .then(res=>{
            if (res.response) {
                setIsVisible(false);
                Alert.alert(
                    "Éxito",
                    `Se aplico tu promocion de manera correcta`,
                    [
                        {
                            text:"Escanear otro codigo",
                            style: "cancel",
                            onPress: () => {
                                navigation.navigate('scan');
                            }
                        }
                    ],
                    {
                        cancelable:false
                    }
                )
            } else {
                setIsVisible(false)
                res.result == 401 && sigout();
                setTimeout(() => {
                    Alert.alert(
                        "Error",
                        `${res.errors}`,
                        [
                            {
                                text:"Aceptar",
                                style: "cancel"
                            }
                        ],
                        {
                            cancelable:false
                        }
                    )
                },1);
                
            }
        });
    }

    return (
        <View style={{height:'100%',backgroundColor:'#fff', paddingTop: Platform.OS == 'ios' ? Constants.statusBarHeight * 2 : Constants.statusBarHeight}}>
            <View style={{height:100,marginLeft:15,marginRight:15,flexDirection:'row', alignItems: 'center'}} >
                <View style={{height:70, width:70, backgroundColor:'#8CCF30', alignItems: 'center',  justifyContent: 'center', borderRadius:10}}>
                    <Image
                        resizeMode = "cover"
                        source = {
                            require("../../../assets/frame.png")
                        }
                        style = {{height:60,width:60,borderRadius:10}}
                    />
                </View>
                <Text style={{fontSize:25,fontWeight:'bold',marginLeft:5}} allowFontScaling={false}> {nombre} </Text>
            </View>
            <View style={{marginLeft:15,marginRight:15,height:'60%'}}>
                <Text style={{fontSize:20,fontWeight:'bold',marginBottom: 20}} allowFontScaling={false}>Elige una promoción</Text>
                {
                    !promos ? <Text style={{fontWeight: 'bold', color: 'grey', fontSize: 17}} allowFontScaling={false}>No hay promociones en este establecimiento</Text> : <ListPromos promos = {promos} promoSelect = {promoSelect} setPromoSelect = {setPromoSelect}/>
                }
            </View>
            <View style={{height: 120, flexDirection: 'column', justifyContent: 'space-evenly', bottom: 10, position: 'absolute'}}>
                <View style={{flexDirection:'row', height:'20%',marginLeft:15,marginRight:15,alignItems: 'center', justifyContent:'center',}}>
                        <Button title = 'Aplicar promo' containerStyle = {styles.btnContainer} buttonStyle ={styles.btnDescontar} 
                            onPress = { () =>addEscan()}
                        />
                </View>
                <View style={{flexDirection:'row', height:'5%',marginLeft:15,marginRight:15,alignItems: 'center', justifyContent:'center', marginTop: 20}}>
                    <Button title = 'Regresar' containerStyle = {styles.btnContainer} buttonStyle ={styles.btnDescontar} 
                        onPress = { () => {navigation.goBack() }} 
                    />
                </View>
            </View>
            <Loader isVisible = {isVisible} text="Cargando ..."/>
        </View>
    )
}

export default ScreeanListPromos

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
