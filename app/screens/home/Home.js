import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, ScrollView, StatusBar, Platform, TouchableOpacity, Alert, TextInput, ImageBackground } from 'react-native';
import { Image, Button } from 'react-native-elements';
import * as SecureStore from 'expo-secure-store';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { retrieveToken } from '../../features/auth/authSlice';
import Loader from '../../components/Loader';
import Api from '../../utils/Api';
import { selectEstablishment } from '../../features/selectEstab/selectEstabSlice';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

moment.updateLocale('en', {
  months: [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio",
    "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ]
});

const Home = ({ navigation }) => {
  const [infoUser, setInfoUser] = useState(null);
  const [numDescuentos, setNumDescuentos] = useState(null);
  const [infoPantalla, setInfoPantalla] = useState(null);
  const [dia, setDia] = useState('Ayer');
  const dispatch = useDispatch();
  const { token, estabs } = useSelector((state) => state.auth);
  const { selectedEstab } = useSelector((state) => state.selectEstab);

  const buscarPromos = async () => {
    setInfoUser(null);
    setNumDescuentos(null);
    let startdate = moment();
    if (dia === 'Ayer') {
      startdate.subtract(1, 'd');
    }
    let fecha = startdate.format('YYYY-MM-DD');
    let token = await SecureStore.getItemAsync('token');
    let textJson = global.atob(token);
    let infoUser = JSON.parse(textJson);
    infoUser.data.idEstab = selectedEstab.id;
    infoUser.data.NombreEstab = selectedEstab.name;
    setInfoUser(infoUser.data);
    let api = new Api(`promotion/count/${infoUser.data.idEstab}/${fecha}`, `GET`, null, token);
    await api.call()
      .then(res => {
        if (res.response) {
          let hoy = infoPantalla.hoy === "Hoy" ? 'Ayer' : 'Hoy';
          setInfoPantalla({
            fecha: fecha,
            hoy: hoy
          });
          setNumDescuentos(res.result);
        } else {
          res.result === 401 
        }
      });
    setDia(dia === 'Hoy' ? 'Ayer' : 'Hoy');
  };

  useFocusEffect(
    useCallback(() => {
      if (Platform.OS === 'ios') {
        StatusBar.setBarStyle('dark-content');
      }
      
      (async () => {
        let fecha = moment().format('YYYY-MM-DD');
        dispatch(retrieveToken());
        const storedSelectedEstab = await AsyncStorage.getItem('selectedEstab');
        if (storedSelectedEstab) {
          dispatch(selectEstablishment({ selectedEstab: JSON.parse(storedSelectedEstab) }));
        }
        if (token) {
          let textJson = global.atob(token);
          let infoUser = JSON.parse(textJson);
          setInfoUser(infoUser.data);
          let api = new Api(`promotion/count/${selectedEstab.id}/${fecha}`, `GET`, null, token);
          await api.call()
            .then(res => {
              if (res.response) {
                let hoy = "Hoy";
                setInfoPantalla({
                  fecha: fecha,
                  hoy: hoy
                });
                setNumDescuentos(res.result);
              } else {
                res.result === 401 
              }
            });
        }
      })();
    }, [dispatch, token, selectedEstab])
  );

  const selectEstab = (idEstablecimiento, NombreEstab) => {
    Alert.alert(
      "Seleccionar establecimiento",
      `¿Estás seguro de seleccionar "${NombreEstab}" como tu establecimiento?`,
      [
        {
          text: "Cancelar",
          onPress: () => console.log("Cancelado"),
          style: "cancel"
        },
        {
          text: "Seleccionar",
          onPress: () => {
            const estabData = { id: idEstablecimiento, name: NombreEstab };
            dispatch(selectEstablishment({ selectedEstab: estabData }));
            AsyncStorage.setItem('selectedEstab', JSON.stringify(estabData));
          }
        }
      ]
    );
  };

  const sigout = () => {
    // Función para manejar cierre de sesión
    // Puedes implementar aquí tu lógica para manejar el cierre de sesión
    console.log('Cierre de sesión');
  };

  const colors = ['#90CD2E', '#FBE000', '#E7007A', '#4ED4DB', '#08A1F0', '#B800DC'];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        
        <View style={styles.imgTopContainer}>
          <ImageBackground source={require('../../../assets/topHome.jpg')} style={styles.imgTop}>
            <Text style={styles.textImg}>Bienvenido!</Text>
          </ImageBackground>
        </View>

        <View style={styles.body}>
          <View style={styles.searchContainer}>
            <View style={styles.inputSearch}>
              <TextInput placeholder='Buscar...' placeholderTextColor={'white'}></TextInput>
              <TouchableOpacity>
                <FontAwesome style={{top:3}} name='search' size={20} color='white'/>
              </TouchableOpacity>
            </View>

            <Text style={{fontSize:28, fontWeight:'700',marginTop:10}}>Selecciona un establecimiento:</Text>
          </View>

          <View style={styles.cardContainer}>
            {estabs && estabs.length > 0 ? (
              estabs.map((estab, index) => (
                <TouchableOpacity key={estab.id} style={[styles.card,{backgroundColor: colors[index % colors.length]}]} onPress={() => selectEstab(estab.id, estab.nombre)}>
                  <Image source={require('../../../assets/backLogin.jpg')} style={styles.imgCard} />
                  <Text style={{fontSize:25, fontWeight:'700'}}>{estab.nombre}</Text>
                  <View style={styles.iconContainer}>
                    <MaterialCommunityIcons name='arrow-collapse-right' size={20} color='black' />
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.noEstablishments}>
                <Text style={{ textAlign: 'center', marginHorizontal: 40, fontSize: 20 }}>
                  Aún no tienes asignado ningún establecimiento.
                </Text>
              </View>
            )}
          </View>
        </View>

      </ScrollView>
    </View>
  )
}

export default Home

const styles = StyleSheet.create({
  container:{
    flex:1,
  },
  imgTop:{
    width:'100%',
    height:250,
    resizeMode:'cover',
    justifyContent:'flex-end',
  },
  imgTopContainer:{
    width:'100%',
  },
  scrollContainer:{
    flexGrow:1,
  },
  textImg:{
    color:'white',
    fontSize:30,
    fontWeight:'700',
    paddingBottom:35,
    paddingLeft:20,
  },
  body:{
    backgroundColor:'white',
    width:'100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop:-20
  },
  card:{
    marginVertical:10,
    flexDirection:'row',
    alignItems:'center',
    width:'100%',
    borderRadius:30,
    height:150,
    paddingLeft:20,
  },
  cardContainer: {
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    width:'100%'
  },
  inputSearch:{
    width:'80%',
    flexDirection:'row',
    backgroundColor:'gray',
    borderRadius:20,
    padding:3,
    paddingLeft:10,
    paddingRight:10,
    justifyContent:'space-between'
  },
  searchContainer:{
    width:'100%',
    justifyContent:'center',
    alignItems:'center',
    marginVertical:15
  },
  imgCard:{
    width:70,
    height:70,
    marginRight:5,
    borderRadius:50
  },
  iconContainer:{
    position:'absolute',
    right:10,
    bottom:10,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius:30,
    padding:12
  }
})