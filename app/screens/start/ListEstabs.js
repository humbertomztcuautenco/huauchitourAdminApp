import React, { useEffect } from 'react';
import { StyleSheet, View, ScrollView, Alert, TouchableOpacity, Platform } from 'react-native';
import { ListItem, Icon, Text } from "react-native-elements";
import Constants from 'expo-constants';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { toggle } from '../../features/selectEstab/selectEstabSlice';
import { retrieveToken } from '../../features/auth/authSlice'; // Asegúrate de importar esto si aún no lo tienes

const ListEstabs = (props) => {

  const dispatch = useDispatch();
  const { navigation } = props;
  const { estabs } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(retrieveToken()); // Llama a retrieveToken para asegurarte de obtener el token al cargar el componente
  }, [dispatch]);

  const selectEstab = async (idEstablecimiento, NombreEstab) => {
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
          onPress: async () => {
            const estabData = { id: idEstablecimiento, name: NombreEstab };
            await AsyncStorage.setItem('estabSelect', JSON.stringify(estabData));
            dispatch(toggle(estabData));
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={{ margin: 15 }} onPress={() => navigation.navigate('login')}>
        <Ionicons name="arrow-back" size={40} />
      </TouchableOpacity>
      <Text style={{ marginLeft: 15, marginRight: 15, marginBottom: 15 }} h4>
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
  );
};

export default ListEstabs;

const styles = StyleSheet.create({
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
