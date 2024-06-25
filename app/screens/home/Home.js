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
import Icon from 'react-native-vector-icons/FontAwesome'; // Asegúrate de que la importación sea correcta

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

  const colors = ['#90CD2E', '#FBE000', '#E7007A', '#4ED4DB', '#08A1F0', '#B800DC']; // Colores añadidos aquí

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
                <Icon name='search' size={20} color='white'/>
              </TouchableOpacity>
            </View>

            <Text style={{fontSize:28, fontWeight:'700',marginTop:10}}>Selecciona un establecimiento:</Text>
          </View>

          <View style={styles.cardContainer}>
            {estabs && estabs.length > 0 ? (
              estabs.map((estab, index) => (
                <TouchableOpacity key={estab.id} style={[styles.card,{backgroundColor: colors[index % colors.length]}]} onPress={() => selectEstab(estab.id, estab.nombre)}>
                  <Image source={require('../../../assets/backLogin.jpg')} style={styles.imgCard} />
                  <Text style={{fontSize:15, fontWeight:'700'}}>{estab.nombre}</Text>
                  <Icon name='search' size={10} color='black'/>
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

        {/* {selectedEstab && (
          <View style={{ height: '100%', backgroundColor: '#fff', paddingTop: Platform.OS === 'ios' ? Constants.statusBarHeight * 2 : Constants.statusBarHeight }}>
            <View style={{ height: '25%', marginLeft: 15, marginRight: 15 }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Tu negocio</Text>
              <Text style={{ fontSize: 40, fontWeight: 'bold' }}>{selectedEstab.name}</Text>
            </View>
            <View style={styles.partMidel}>
              <Text style={{ color: '#fff' }}>{infoPantalla?.fecha}</Text>
              <Text style={{ color: '#fff', fontSize: 17 }}>Descuentos de</Text>
              <Text style={{ color: '#fff', fontSize: 30 }}>{infoPantalla?.hoy}</Text>
              <Text style={{ color: '#fff', fontSize: 75 }}>{numDescuentos ? numDescuentos : <ActivityIndicator size={27} color="#fff" />}</Text>
              <Button onPress={() => buscarPromos()} containerStyle={styles.btnAyer} buttonStyle={{ backgroundColor: '#fff', width: 80 }} titleStyle={{ color: 'black' }} title={dia} />
            </View>
            <View style={{ flexDirection: 'row', height: '25%', marginLeft: 15, marginRight: 15, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 16 }}>Te deseamos excelentes ventas hoy.</Text>
            </View>
          </View>
        )} */}
      </ScrollView>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  imgTopContainer: {
    height: 200,
  },
  imgTop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textImg: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  body: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  searchContainer: {
    marginVertical: 10,
  },
  inputSearch: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  cardContainer: {
    marginVertical: 20,
  },
  card: {
    marginBottom: 10,
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  imgCard: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  noEstablishments: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  partMidel: {
    height: '50%',
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnAyer: {
    marginTop: 20,
  },
});
