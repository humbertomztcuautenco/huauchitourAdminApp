import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, ScrollView, StatusBar, Platform, TouchableOpacity, Alert, TextInput, ImageBackground } from 'react-native';
import { Image, Button } from 'react-native-elements';
import * as SecureStore from 'expo-secure-store';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../../components/Loader';
import Api from '../../utils/Api';
import { selectEstablishment, deselectEstab } from '../../features/selectEstab/selectEstabSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { color } from 'react-native-elements/dist/helpers';
import { useNavigation } from '@react-navigation/native';
import TabNavigation from '../../navigation/TabNavigation'
import { useFocusEffect } from '@react-navigation/native';


moment.updateLocale('en', {
  months: [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio",
    "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ]
});


const SelectEstab = ({ navigation }) => {
  const dispatch = useDispatch();
  const { token, estabs } = useSelector((state) => state.auth);
  const { selectedEstab } = useSelector((state) => state.selectEstab);
  const navegacion = useNavigation();
  


  const selectEstab = (idEstablecimiento, NombreEstab, color) => {
    Alert.alert(
      "Seleccionar establecimiento",
      `¿Estás seguro de seleccionar "${NombreEstab}" como tu establecimiento?`,
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Seleccionar",
          onPress: () => {
            const estabData = { id: idEstablecimiento, name: NombreEstab, color: color };
            dispatch(selectEstablishment({ selectedEstab: estabData }));
            AsyncStorage.setItem('selectedEstab', JSON.stringify(estabData));
          }
        }
      ]
    );
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

        if (token) {
          let textJson = global.atob(token);
          let infoUser = JSON.parse(textJson);
          infoUser.data.idEstab = selectedEstab.id;
          infoUser.data.NombreEstab = selectedEstab.name

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


  const colors = ['#90CD2E', '#FBE000', '#E7007A', '#4ED4DB', '#08A1F0', '#B800DC'];

  if(selectedEstab){
    return(
      <>{<TabNavigation/>}</>
    )
  }
  
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
              <TextInput placeholder='Buscar...' placeholderTextColor={'white'} style={{width:'90%'}}></TextInput>
              <TouchableOpacity>
                <FontAwesome style={{ top: 3 }} name='search' size={20} color='white' />
              </TouchableOpacity>
            </View>

            <Text style={{ fontSize: 28, fontWeight: '700', marginTop: 10 }}>Selecciona un establecimiento el chido papu:</Text>
          </View>

          <View style={styles.cardContainer}>
            {estabs && estabs.length > 0 ? (
              estabs.map((estab, index) => (
                <TouchableOpacity key={estab.id} style={[styles.card, { backgroundColor: colors[index % colors.length] }]} onPress={() => selectEstab(estab.id, estab.nombre, colors[index % colors.length])}>
                  <Image source={require('../../../assets/backLogin.jpg')} style={styles.imgCard} />
                  <Text style={{ fontSize: 25, fontWeight: '700' }}>{estab.nombre}</Text>
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

export default SelectEstab

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imgTop: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
    justifyContent: 'flex-end',
  },
  imgTopContainer: {
    width: '100%',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  textImg: {
    color: 'white',
    fontSize: 30,
    fontWeight: '700',
    paddingBottom: 35,
    paddingLeft: 20,
  },
  body: {
    backgroundColor: 'white',
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20
  },
  card: {
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderRadius: 30,
    height: 150,
    paddingLeft: 20,
  },
  cardContainer: {
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    width: '100%'
  },
  inputSearch: {
    width: '80%',
    flexDirection: 'row',
    backgroundColor: 'gray',
    borderRadius: 20,
    padding: 3,
    paddingLeft: 10,
    paddingRight: 10,
    justifyContent: 'space-between'
  },
  searchContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 15
  },
  imgCard: {
    width: 70,
    height: 70,
    marginRight: 5,
    borderRadius: 50
  },
  iconContainer: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 30,
    padding: 12
  }
})