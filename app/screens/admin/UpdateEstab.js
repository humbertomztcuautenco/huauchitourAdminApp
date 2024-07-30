import React, { Component, useState } from 'react'
import { Text, View,  StyleSheet, ScrollView, TextInput, TouchableOpacity, useWindowDimensions, Button, Alert } from 'react-native'
import { useSelector, useDispatch } from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Parser } from 'htmlparser2';
import { deselectEstab } from '../../features/selectEstab/selectEstabSlice';
import { useNavigation } from '@react-navigation/native';



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
const { width } = useWindowDimensions();
const [text, setText] = useState(extractTextFromHTML(selectedEstablishment.selectedEstab.data.info));
const navigation = useNavigation()
const dispatch = useDispatch()


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

return (
<View style={styles.container}>
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <TouchableOpacity onPress={returnEstab}>
        <Text>atras</Text>
      </TouchableOpacity>
        <View>
            <Text>Establecimiento no.{selectedEstablishment.selectedEstab.data.id}</Text>
            <Text>{selectedEstablishment.selectedEstab.data.nombre}</Text>
            <View style={styles.inputContainer}>
                <Text style={styles.textInput}>Descripcion</Text>
                <View style={[styles.inputSearch,{borderColor:color}]}>
                <TextInput placeholder='Correo' style={{width:'90%'}} multiline onChangeText={setText} numberOfLines={10} value={text}></TextInput>
                <TouchableOpacity>
                    <MaterialIcons style={{ top: 3 }} name='edit' size={20} color={color} />
                </TouchableOpacity>
            </View>
            {/* <RenderHTML contentWidth={width} source={{ html: selectedEstablishment.selectedEstab.data.info }} /> */}

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
  },
  textArea: {
    height: 150,
    justifyContent: "flex-start",
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    marginTop: 10,
    width: '100%',
  }
})

