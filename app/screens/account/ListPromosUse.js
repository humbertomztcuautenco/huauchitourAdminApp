import React,{useCallback,useState} from 'react'
import { StyleSheet, Text, View, ScrollView,ActivityIndicator, TouchableOpacity} from 'react-native'
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import moment from 'moment';

import {AuthContext} from '../../utils/context';
import Api from '../../utils/Api';
import ListaPromosUsadas from '../../components/account/ListPromosUsadas';
import Constants from 'expo-constants';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'react-native';

const ListPromosUse = () => {
    const navigation = useNavigation();
    const {sigout} = React.useContext(AuthContext);
    const [listPromos, setListPromos] = useState(null)

    useFocusEffect(
        useCallback(() => {
            ( async()=>{
                let fecha = moment().format('yyyy-MM-DD')
                let token = await SecureStore.getItemAsync('userToken');
                let textJson = global.atob(token);
                let infoUser = JSON.parse(textJson);
                // setInfoUser(infoUser.data);
                let api = new Api(`promotion/listEstabDate/${infoUser.data.idEstab}/${fecha}`,`GET`,null,token);
                await api.call()
                .then(res=>{
                    if (res.response) {
                        setListPromos(res.result)
                    } else {
                        res.result == 401 && sigout();
                    }
                });
            })()
        },[])
    )

    return (
        <View style={{backgroundColor:'#fff',height:'100%', paddingTop: Platform.OS == 'ios' ? Constants.statusBarHeight * 1.5 : Constants.statusBarHeight * 0.5}}>
            <View style={{marginLeft:15,marginRight:15}}>
                <TouchableOpacity style={{marginBottom: 15}} onPress={()=> navigation.navigate('account')}>
                    <Ionicons 
                        name="arrow-back"
                        size={40}
                    />
                </TouchableOpacity>
                <Text style={{fontSize:30,fontWeight:'bold', marginBottom: 10}} allowFontScaling={false}>Promociones usadas hoy</Text>
            </View>
            {
                !listPromos ?
                (
                    <ActivityIndicator color = "black" size = "large" style= {{marginTop:20}} />
                    
                ):(
                    listPromos.length == 0 ? 
                    (
                        <View style={{margin: 15}} >
                            <Text style={{fontSize:20,fontWeight:'bold', color: 'gray'}} allowFontScaling={false}>No se han aplicado promociones hoy</Text>
                        </View>
                    ) : (
                        <ListaPromosUsadas listPromos = { listPromos } />
                    )
                )
            }
        </View>
    )
}

export default ListPromosUse

const styles = StyleSheet.create({})
