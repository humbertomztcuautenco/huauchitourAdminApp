import React, { Component } from 'react'
import { Text, View,  StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native'
import { useSelector } from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';


const UpdateEstab = () => {
const selectedEstablishment = useSelector((state) => state.selectEstab);
const color = selectedEstablishment.selectedEstab.color

//console.log(selectedEstablishment.selectedEstab.name)

return (
<View style={styles.container}>
    <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View>
            <Text>Establecimiento no.{selectedEstablishment.selectedEstab.id}</Text>
            <Text>{selectedEstablishment.selectedEstab.name}</Text>
            <View style={styles.inputContainer}>
                <Text style={styles.textInput}>Descripcion</Text>
                <View style={[styles.inputSearch,{borderColor:color}]}>
                <TextInput placeholder='Correo' style={{width:'90%'}} value={'hi'}></TextInput>
                <TouchableOpacity>
                    <MaterialIcons style={{ top: 3 }} name='edit' size={20} color={color} />
                </TouchableOpacity>
            </View>
        </View>
        </View>
    </ScrollView>
  </View>
)
}

export default UpdateEstab

const styles = StyleSheet.create({
container:{
    flex:1,
},
scrollContainer:{
    flexGrow:1,
    justifyContent:'center',
    alignItems:'center',
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
  inputContainer: {
    marginVertical: 15
  }
})

