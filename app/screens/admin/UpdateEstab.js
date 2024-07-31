import React, { Component, useState } from 'react'
import { Text, View,  StyleSheet, ScrollView, TextInput, TouchableOpacity, useWindowDimensions, Button, Alert } from 'react-native'
import { useSelector, useDispatch } from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Parser } from 'htmlparser2';
import { deselectEstab } from '../../features/selectEstab/selectEstabSlice';



const extractTextFromHTML = (html) => {
  let text = '';
  const parser = new Parser({
    ontext(data) {
      text += data;
    },
  });
  parser.write(html);
  parser.end();
  return text;
};

const reconstructHTML = (originalHtml, newText) => {
  const parts = originalHtml.split(/(<\/?[^>]+>)/g);
  let textIndex = 0;
  return parts.map((part) => {
    if (!part.startsWith('<')) {
      const length = part.length;
      const text = newText.slice(textIndex, textIndex + length);
      textIndex += length;
      return text;
    }
    return part;
  }).join('');
};


const UpdateEstab = ({htmlDescription}) => {
const selectedEstablishment = useSelector((state) => state.selectEstab);
const color = selectedEstablishment.selectedEstab.color
const [establishment, setEstablishment] = useState({
      calificacion: selectedEstablishment.selectedEstab.data.calificacion,
      centroAutorizado: selectedEstablishment.selectedEstab.data.centroAutorizado,
      descripcion: selectedEstablishment.selectedEstab.data.descripcion,
      direccion: selectedEstablishment.selectedEstab.data.direccion,
      id: selectedEstablishment.selectedEstab.data.id,
      idPersona: selectedEstablishment.selectedEstab.data.idPersona,
      info: selectedEstablishment.selectedEstab.data.info,
      latitud: selectedEstablishment.selectedEstab.data.latitud,
      longitud: selectedEstablishment.selectedEstab.data.longitud,
      nombre: selectedEstablishment.selectedEstab.data.nombre,
      status: selectedEstablishment.selectedEstab.data.status,
      telefono: selectedEstablishment.selectedEstab.data.telefono,
      tipo: selectedEstablishment.selectedEstab.data.tipo,
      urlImg: selectedEstablishment.selectedEstab.data.urlImg,
      urlImgPerfil: selectedEstablishment.selectedEstab.data.urlImgPerfil
    
});

const [rating, setRating] = useState(establishment.calificacion);
const { width } = useWindowDimensions();
const [text, setText] = useState(extractTextFromHTML(selectedEstablishment.selectedEstab.data.info));
const dispatch = useDispatch()

const handleSave = () => {
  const newHtml = reconstructHTML(originalHtml, text);
  setUpdatedHtml(newHtml);
  console.log('Nuevo HTML:', newHtml);
};

const updateEstab = (field, value) => {
  setEstablishment({
    ...establishment,
    [field]: value,
  });
};


const returnEstab = () => {
  Alert.alert(
    "Deseleccionar establecimiento",
    "¿Estás seguro de deseleccionar tu establecimiento actual?",
    [
      {
        text: "Cancelar",
        style: "cancel"
      },
      {
        text: "Deseleccionar",
        onPress: async () => {
          dispatch(deselectEstab());
          await AsyncStorage.removeItem('selectedEstab');
        }
      }
    ]
  );
}

console.log(establishment)

const handleRating = (newRating) => {
  setRating(newRating);
};

return (
<View style={styles.container}>
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <TouchableOpacity onPress={returnEstab}>
        <Text>atras</Text>
      </TouchableOpacity>
        <View>
            <Text>Establecimiento no.{selectedEstablishment.selectedEstab.data.id}</Text>
            <View style={styles.inputContainer}>
                <Text style={styles.textInput}>Nombre</Text>
                <View style={[styles.inputSearch,{borderColor:color}]}>
                  <TextInput placeholder='Nombre del establecimiento' style={{width:'90%'}} value={establishment.nombre} onChangeText={(value) => updateEstab('nombre', value)}></TextInput>
                  <TouchableOpacity>
                    <MaterialIcons style={{ top: 3 }} name='edit' size={20} color={color} />
                  </TouchableOpacity>
                </View>
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.textInput}>Descripcion</Text>
                <View style={[styles.inputSearch,{borderColor:color}]}>
                  <TextInput placeholder='Descripcion' style={{width:'90%'}} value={establishment.descripcion} onChangeText={(value) => updateEstab('descripcion', value)}></TextInput>
                  <TouchableOpacity>
                    <MaterialIcons style={{ top: 3 }} name='edit' size={20} color={color} />
                  </TouchableOpacity>
                </View>
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.textInput}>Informacion</Text>
                <View style={[styles.inputSearch,{borderColor:color}]}>
                  <TextInput placeholder='Descripcion' style={{width:'90%'}} multiline onChangeText={setText} numberOfLines={10} value={text}></TextInput>
                  <TouchableOpacity>
                    <MaterialIcons style={{ top: 3 }} name='edit' size={20} color={color} />
                  </TouchableOpacity>
                </View>
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.textInput}>Telefono</Text>
                <View style={[styles.inputSearch,{borderColor:color}]}>
                  <TextInput placeholder='Telefono' style={{width:'90%'}} keyboardType='numeric' value={establishment.telefono} onChangeText={(value) => updateEstab('telefono', value)}></TextInput>
                  <TouchableOpacity>
                    <MaterialIcons style={{ top: 3 }} name='edit' size={20} color={color} />
                  </TouchableOpacity>
                </View>
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.textInput}>Direccion</Text>
                <View style={[styles.inputSearch,{borderColor:color}]}>
                  <TextInput placeholder='Telefono' style={{width:'90%'}} value={establishment.direccion} onChangeText={(value) => updateEstab('direccion', value)}></TextInput>
                  <TouchableOpacity>
                    <MaterialIcons style={{ top: 3 }} name='edit' size={20} color={color} />
                  </TouchableOpacity>
                </View>
            </View>

            <View style={styles.rating}>
              <Text>Calificacion</Text>
              <View style={styles.stars}>
                {Array.from({ length: 5 }, (_, index) => (
                  <TouchableOpacity key={index} onPress={() => handleRating(index + 1)}>
                    <MaterialIcons
                      name={index < rating ? 'star' : 'star-border'}
                      size={30}
                      color={index < rating ? '#FFD700' : '#CCCCCC'}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            
        </View>

        <TouchableOpacity onPress={updateEstab}>
          <Text>Actualizar</Text>
        </TouchableOpacity>
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
  },
  textArea: {
    height: 150,
    justifyContent: "flex-start",
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    marginTop: 10,
    width: '100%',
  },
  rating:{
    marginVertical:20
  },
  stars:{
    flexDirection:'row'
  }
})

