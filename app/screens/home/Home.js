import React,{ useState,useEffect,useCallback} from 'react'
import { StyleSheet, Text, View, ActivityIndicator, StatusBar, Platform} from 'react-native';
import { Button ,Image} from "react-native-elements";
import * as SecureStore from 'expo-secure-store';
import { useFocusEffect } from '@react-navigation/native';
import moment from 'moment';
moment.updateLocale('en', {
    months : [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio",
        "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ]
});

import Loader from '../../components/Loader';
import Api from '../../utils/Api';
import {AuthContext} from '../../utils/context';
import Constants from 'expo-constants';

const Home = () => {
    const [infoUser, setInfoUser] = useState(null)
    const {sigout} = React.useContext(AuthContext);
    const [numDescuentos, setNumDescuentos] = useState(null);
    const [infoPantalla, setInfoPantalla] = useState(null)
    const [dia, setDia] = useState('Ayer') 

    const buscarPromos = async() => {
        setInfoUser(null);
        setNumDescuentos(null);
        // console.log("buscar promos de ayer");
        let startdate = moment();
        if(dia == 'Ayer'){
            startdate.subtract(1, 'd');
        }
        let fecha = startdate.format('yyyy-MM-DD');
        let token = await SecureStore.getItemAsync('userToken');
        let textJson = global.atob(token);
        let infoUser = JSON.parse(textJson);
        setInfoUser(infoUser.data);
        let api = new Api(`promotion/count/${infoUser.data.idEstab}/${fecha}`,`GET`,null,token);
        await api.call()
        .then(res=>{
            if (res.response) {
                let hoy;
                if (infoPantalla.hoy == "Hoy") {
                    hoy = 'Ayer'
                } else {
                    hoy = 'Hoy'
                }
                setInfoPantalla ({
                    fecha:fecha,
                    hoy:hoy
                });
                setNumDescuentos(res.result)
            } else {
                res.result == 401 && sigout();
            }
        });
        if (dia == 'Hoy') {
            setDia('Ayer')
        } else {
            setDia('Hoy')
        }
    };

    useFocusEffect(
        useCallback(() => {
            if(Platform.OS == 'ios'){
                StatusBar.setBarStyle('dark-content');
            }

            (async()=>{
                let fecha = moment().format('yyyy-MM-DD')
                let token = await SecureStore.getItemAsync('userToken');
                let textJson = global.atob(token);
                let infoUser = JSON.parse(textJson);
                setInfoUser(infoUser.data);
                let api = new Api(`promotion/count/${infoUser.data.idEstab}/${fecha}`,`GET`,null,token);
                await api.call()
                .then(res=>{
                    if (res.response) {
                        let hoy  = "Hoy"
                        setInfoPantalla ({
                            fecha:fecha,
                            hoy:hoy
                        });
                        setNumDescuentos(res.result);
                    } else {
                        // console.log(res);
                        res.result == 401 && sigout();
                    }
                });
            })()
        },[])
    )

    return (
        !infoUser ? (
            <Loader/>
        ) : (
            !infoPantalla ? (
                <Loader/>
            ) : (
            <View style ={{height:'100%',backgroundColor:'#fff', paddingTop: Platform.OS == 'ios' ? Constants.statusBarHeight * 2 : Constants.statusBarHeight}} >
                <View style={{height:'25%',marginLeft:15,marginRight:15}} >
                    <Text style={{fontSize:16,fontWeight:'bold'}}allowFontScaling={false}>Tu negocio</Text>
                    <Text style={{fontSize:40,fontWeight:'bold'}}allowFontScaling={false}>{infoUser.NombreEstab}</Text>
                </View>
                <View style={styles.partMidel}>
                    <Text style={{color:'#fff'}}allowFontScaling={false}>{infoPantalla.fecha}</Text>
                    <Text style={{color:'#fff',fontSize:17}}allowFontScaling={false}>Descuentos de</Text>
                    <Text style={{color:'#fff',fontSize:30}}allowFontScaling={false}>{infoPantalla.hoy}</Text>
                    <Text style={{color:'#fff',fontSize:75}}>{numDescuentos ? numDescuentos : <ActivityIndicator size={27} color="#fff"/>}</Text>
                    <Button onPress = {()=>buscarPromos()} allowFontScaling={false} containerStyle ={styles.btnAyer} buttonStyle={{backgroundColor:'#fff',width:80}} titleStyle={{color:'black'}} title={dia}/>
                </View>
                <View style={{flexDirection:'row', height:'25%',marginLeft:15,marginRight:15,alignItems: 'center', justifyContent:'center'}}>
                    <Text style={{fontSize:16}}allowFontScaling={false}>Te deseamos excelentes ventas hoy.</Text>
                    <Image
                        resizeMode = "cover"
                        source = {
                                require("../../../assets/likeDraw.png")
                            }
                        style = {{height:80,width:80}}
                        PlaceholderContent={<ActivityIndicator />}
                        placeholderStyle = {{backgroundColor:'#fff'}}
                    />
                </View>
            </View>
            )
        )
    )
}

export default Home

const styles = StyleSheet.create({
    partMidel : {
        height:'50%',
        marginLeft:15,
        marginRight:15,
        backgroundColor:'#B728FF',
        borderRadius:20,
        padding:20,
        alignItems:'center',
    },
    btnAyer:{
        position : "absolute",
        bottom: 10,
        left : 10,
        borderRadius: 13
    }
})
