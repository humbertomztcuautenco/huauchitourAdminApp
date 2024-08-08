import React, { Component, useState, useEffect, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { Text, View, StyleSheet, TouchableOpacity, Image, ScrollView, Alert } from 'react-native'
import Api from '../../utils/Api'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Loader from '../../components/Loader';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { selectEstablishment } from '../../features/selectEstab/selectEstabSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UpdateEstab from './UpdateEstab';



const AdminHome = ({item}) =>  {
  const [estabs,setEstabs] = useState([])
  const { token } = useSelector((state) => state.auth);
  const { selectedEstab } = useSelector((state) => state.selectEstab);
  const [loading, setLoading] = useState(false);


  const navigation = useNavigation()
  const dispatch = useDispatch()


  //console.log('///////////////////////')
  //console.log(selectedEstab)
    useFocusEffect(
      useCallback(() => {
        const consultEstabs = async () => {
          try {
            let api = new Api('establishment/list', 'GET', null, token);
            const res = await api.call();
            
            if (res.result) {
              setEstabs(res.result);
              setLoading(true);
            } else if (res.result === 401) {
              console.log('server error')
            }
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
  
        consultEstabs();
      }, [token, setEstabs, setLoading])
    );


  const selectEstab = (id, NombreEstab, color) => {
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
            const estabData = { id: id, color: color };
            dispatch(selectEstablishment({ selectedEstab: estabData }));
            AsyncStorage.setItem('selectedEstab', JSON.stringify(estabData));
          }
        }
      ]
    );
  };
  
  //console.log(selectedEstab)
  const colors = ['#90CD2E', '#FBE000', '#E7007A', '#4ED4DB', '#08A1F0', '#B800DC'];

  return (
    !selectedEstab ? (
      !loading ? (
        <Loader/>
      ):(
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>

        <View>
          <Text>Admin crud</Text>
        </View>

        <View style={styles.cardContainer}>
            {estabs && estabs.length > 0 ? (
              estabs.map((estab, index) => (
                <TouchableOpacity key={estab.id} style={[styles.card, { backgroundColor: colors[index % colors.length]}]} onPress={() => selectEstab(estab.id, estab.nombre, colors[index % colors.length])}>
                  <Image source={ estab.urlImgPerfil ? {uri: estab.urlImgPerfil} : (require('../../../assets/loadImage.jpeg'))} style={styles.imgCard} />
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

      </ScrollView>
    </View>
      )
    ):(<UpdateEstab/>)
  )
}

export default AdminHome


const styles = StyleSheet.create({
container:{
  flex:1
},
scrollContainer:{
  flexGrow:1
},
card: {
  marginVertical: 10,
  flexDirection: 'row',
  alignItems: 'center',
  width: '100%',
  borderRadius: 30,
  height: 150,
  paddingLeft: 20,
  borderWidth: 1,
  borderColor: 'transparent',
  borderRadius: 30,
  shadowColor: 'black',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.8,
  shadowRadius: 4,
  elevation: 5,
},
cardContainer: {
  flexWrap: 'wrap',
  justifyContent: 'space-around',
  paddingHorizontal: 20,
  width: '100%',
  
},
iconContainer: {
  position: 'absolute',
  right: 10,
  bottom: 10,
  backgroundColor: 'rgba(255, 255, 255, 0.6)',
  borderRadius: 30,
  padding: 12
},
imgCard: {
  width: 70,
  height: 70,
  marginRight: 5,
  borderRadius: 50
}
})
