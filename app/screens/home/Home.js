import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, ScrollView, StatusBar, Platform, TouchableOpacity, Alert } from 'react-native';
import { Button, Image, ListItem, Icon } from "react-native-elements";
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

  return (
    selectedEstab === null ? (
      <View style={styles.container}>
        <TouchableOpacity style={{ margin: 15 }} onPress={() => navigation.navigate('login')}>
          <Ionicons name="arrow-back" size={40} />
        </TouchableOpacity>
        <Text style={{ marginLeft: 15, marginRight: 15, marginBottom: 15, fontSize: 24 }}>
          Selecciona un establecimiento:
        </Text>
        {estabs && estabs.length > 0 ? (
          <ScrollView>
            {estabs.map((estab) => (
              <ListItem key={estab.id} bottomDivider onPress={() => selectEstab(estab.id, estab.nombre)}>
                <Icon raised name='sign-in' type='font-awesome' />
                <ListItem.Content>
                  <ListItem.Title>{estab.nombre}</ListItem.Title>
                </ListItem.Content>
                <ListItem.Chevron />
              </ListItem>
            ))}
          </ScrollView>
        ) : (
          <View style={styles.noEstablishments}>
            <Text style={{ textAlign: 'center', marginHorizontal: 40, fontSize: 20 }}>
              Aún no tienes asignado ningún establecimiento.
            </Text>
          </View>
        )}
      </View>
    ) : !infoUser ? (
      <Loader />
    ) : !infoPantalla ? (
      <Loader />
    ) : (
      <View style={{ height: '100%', backgroundColor: '#fff', paddingTop: Platform.OS === 'ios' ? Constants.statusBarHeight * 2 : Constants.statusBarHeight }}>
        <View style={{ height: '25%', marginLeft: 15, marginRight: 15 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Tu negocio</Text>
          <Text style={{ fontSize: 40, fontWeight: 'bold' }}>{selectedEstab.name}</Text>
        </View>
        <View style={styles.partMidel}>
          <Text style={{ color: '#fff' }}>{infoPantalla.fecha}</Text>
          <Text style={{ color: '#fff', fontSize: 17 }}>Descuentos de</Text>
          <Text style={{ color: '#fff', fontSize: 30 }}>{infoPantalla.hoy}</Text>
          <Text style={{ color: '#fff', fontSize: 75 }}>{numDescuentos ? numDescuentos : <ActivityIndicator size={27} color="#fff" />}</Text>
          <Button onPress={() => buscarPromos()} containerStyle={styles.btnAyer} buttonStyle={{ backgroundColor: '#fff', width: 80 }} titleStyle={{ color: 'black' }} title={dia} />
        </View>
        <View style={{ flexDirection: 'row', height: '25%', marginLeft: 15, marginRight: 15, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 16 }}>Te deseamos excelentes ventas hoy.</Text>
          <Image
            resizeMode="cover"
            source={require("../../../assets/likeDraw.png")}
            style={{ height: 80, width: 80 }}
            PlaceholderContent={<ActivityIndicator />}
            placeholderStyle={{ backgroundColor: '#fff' }}
          />
        </View>
      </View>
    )
  );
};

export default Home;

const styles = StyleSheet.create({
  partMidel: {
    height: '50%',
    marginLeft: 15,
    marginRight: 15,
    backgroundColor: '#B728FF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  btnAyer: {
    position: "absolute",
    bottom: 10,
    left: 10,
    borderRadius: 13
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'ios' ? Constants.statusBarHeight : 0,
  },
  noEstablishments: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
