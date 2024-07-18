import React, { Component } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, TextInput, Image } from 'react-native'
import { color } from 'react-native-elements/dist/helpers';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useSelector } from 'react-redux';




const AccountNewVersion = () => {

const selectedEstablishment = useSelector((state) => state.selectEstab);
let color = '#90cd2e'

if(selectedEstablishment.selectedEstab){
  color = selectedEstablishment.selectedEstab.color
}

return (
  <View style={styles.container}>
    <View style={[styles.backgroundTop, { backgroundColor: color }]}>
      {selectedEstablishment.selectedEstab ? (
        <Text style={styles.estab}>{selectedEstablishment.selectedEstab.name} </Text>
      ) : (
        <Text style={styles.estab}>Perfil</Text>
      )}
    </View>
    <View style={styles.body}>
        <Image style={styles.imageAccount} source={require('../../../assets/topHome.jpg')}/>
        <Text style={{fontSize:25, fontWeight:'600'}}>Editar Perfil</Text>

        <View style={styles.searchContainer}>
            <Text style={styles.textInput}>Correo</Text>
            <View style={[styles.inputSearch,{borderColor:color}]}>
              <TextInput placeholder='Correo' style={{width:'90%'}}></TextInput>
              <TouchableOpacity>
                <MaterialIcons style={{ top: 3 }} name='edit' size={20} color={color} />
              </TouchableOpacity>
            </View>
        </View>

        <View style={styles.searchContainer}>
            <Text style={styles.textInput}>Telefono</Text>
            <View style={[styles.inputSearch,{borderColor:color}]}>
              <TextInput placeholder='Telefono' style={{width:'90%'}}></TextInput>
              <TouchableOpacity>
                <MaterialIcons style={{ top: 3 }} name='edit' size={20} color={color} />
              </TouchableOpacity>
            </View>
        </View>

        <View style={styles.buttonsContainer}>
            <TouchableOpacity style={[styles.buttonSuccess,{backgroundColor:color}]}>
              <Text style={styles.buttonText}>Cerrar Sesion</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonDelete}>
              <Text style={styles.buttonText}>Eliminar cuenta</Text>              
            </TouchableOpacity>
        </View>

        {selectedEstablishment.selectedEstab ? (
          <TouchableOpacity style={{}}>
            <Text style={{




            }}>Vender Membresia</Text>              
          </TouchableOpacity>
        ):(
          <TouchableOpacity style={{}}>
            <Text style={{color:'gray'}}>Para agregar una membresia debes seleccionar un establecimiento antes</Text>              
          </TouchableOpacity>
        )}
    </View>    
  </View>
)
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'white',
    alignItems:'center',
    //justifyContent:'center'
  },
  backgroundTop:{
    width:'100%',
    backgroundColor: color,
    height:240,
    justifyContent:'center',
    alignItems:'center'
  },
  body:{
    width:'100%',
    backgroundColor:'white', 
    justifyContent:'center',
    alignItems:'center',
    borderTopLeftRadius:25,
    borderTopRightRadius:25,
    marginTop:-20

  },
  inputSearch: {
    width: '85%',
    flexDirection: 'row',
    borderRadius: 20,
    padding: 3,
    paddingLeft: 10,
    paddingRight: 10,
    justifyContent: 'space-between',
    borderWidth:1.5
  },
  searchContainer: {
    marginVertical: 15
  },
  imageAccount:{
    width:150,
    height:150,
    borderRadius:100,
    justifyContent:'center',
    alignItems:'center',
    marginTop:-65,
    marginBottom:10
  },
  textInput:{
    fontWeight:'bold',
    fontSize:23,
    marginBottom:10,
    marginLeft:8
  },
  estab:{
    fontSize:30,
    fontWeight:'800'
  },
   buttonSuccess:{
    paddingVertical:10,
    paddingHorizontal:60,
    borderRadius:30,
    marginBottom:20,
    marginTop:20
   },
   buttonDelete:{
    paddingVertical:10,
    paddingHorizontal:60,
    borderRadius:30,
    backgroundColor:'red',
    marginBottom:20
   },
   buttonText:{
    fontSize:20,
    fontWeight:'600',
    color:'white'
   }
})

export default AccountNewVersion
