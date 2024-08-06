import React, { useCallback, useState } from 'react'
import { Text, View,  StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, ImageBackground, Image } from 'react-native'
import { useSelector, useDispatch } from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Parser } from 'htmlparser2';
import { deselectEstab } from '../../features/selectEstab/selectEstabSlice';
import { Picker } from '@react-native-picker/picker';
import Api from '../../utils/Api';
import { useFocusEffect } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import OverlayOptions from '../../components/OverlayOptions';

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
  if (!originalHtml) {
    console.error('Error: originalHtml is undefined or empty');
    return '';
  }

  const parts = originalHtml.split(/(<\/?[^>]+>)/g);
  let textIndex = 0;

  return parts.map((part) => {
    if (typeof part === 'string' && !part.startsWith('<')) {
      const length = part.length;
      const text = newText.slice(textIndex, textIndex + length);
      textIndex += length;
      return text;
    }
    return part;
  }).join('');
};


const UpdateEstab = () => {
const selectedEstablishment = useSelector((state) => state.selectEstab);
const { token } = useSelector((state) => state.auth);
const color = selectedEstablishment.selectedEstab.color
const [imageTop, setImageTop] = useState(null);
const [imagePerfil, setImagePerfil] = useState(null);
const [establishment, setEstablishment] = useState({});
const [rating, setRating] = useState(0);
const [loading, setLoading] = useState(true);
const [visible, setVisible] = useState(false);
const [text, setText] = useState(null);
const [optionType, setOptionType] = useState('')
const dispatch = useDispatch()

const handleSave = () => {
  const newHtml = reconstructHTML(establishment.info || '', text);
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

useFocusEffect(
  useCallback(() => {
    const consultEstab = async () => {
      try {
        let api = new Api(`establishment/obtain/${selectedEstablishment.selectedEstab.id}`, 'GET', null, token);
        const res = await api.call();
        
        if (res.result) {
          setEstablishment(res.result);
          setText(extractTextFromHTML(res.result.info));
        } else if (res.result === 401) {
          console.log('server error')
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    consultEstab();
  }, [token, setEstablishment])
);

const handleRating = (newRating) => {
  setRating(newRating);
};

const selectImage = async (type) => {
  const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (permissionResult.granted === false) {
    alert('Permission to access camera roll is required!');
    return;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: type === 'portada' ? [16, 9] : [3,3],
    quality: 1,
  });

  if (!result.canceled) {
    type === 'portada' ? setImageTop(result.assets[0].uri) : setImagePerfil(result.assets[0].uri);
    }
    setVisible(false)
};

const openOption = (name) =>{
  setOptionType(name)
  setVisible(true)
}

return (
<View style={styles.container}>
    <ScrollView contentContainerStyle={styles.scrollContainer}>

      <View style={styles.imgTopContainer}>
        <TouchableOpacity style={{width:'100%'}} onPress={() => openOption('portada')}>
          <ImageBackground source={loading ? (require('../../../assets/loadImage.jpeg')) : ({uri: imageTop ? imageTop : establishment.urlImg})} style={styles.imgTop} onLoad={() => setLoading(false)}></ImageBackground>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => openOption('perfil')}>
          <Image onLoad={() => setLoading(false)} style={styles.imageAccount} source={loading ? (require('../../../assets/loadImage.jpeg')) : ({uri: imagePerfil ? imagePerfil : establishment.urlImgPerfil})}/>
        </TouchableOpacity>
        </View>

      <TouchableOpacity onPress={returnEstab}>
        <Text>atras</Text>
      </TouchableOpacity>
        <View style={{justifyContent:'center', alignItems:'center'}}>
            <Text>Establecimiento no.{establishment.id}</Text>
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

            <View style={{width:'80%'}}>
            <View style={styles.inputContainer}>
                <Text style={styles.textInput}>Centro autorizado:</Text>
                <Picker selectedValue={establishment.centroAutorizado} style={styles.picker} onValueChange={(value) => updateEstab('centroAutorizado', value)}>
                  <Picker.Item label="Si es un centro autorizado" value="y" />
                  <Picker.Item label="No es un centro autorizado" value="n" />
                </Picker>
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.textInput}>Tipo:</Text>
                <Picker selectedValue={establishment.tipo} style={styles.picker} onValueChange={(value) => updateEstab('tipo', value)}>
                  <Picker.Item label="Establecimiento" value="establecimiento" />
                  <Picker.Item label="Experiencia" value="experiencia" />
                </Picker>
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.textInput}>Tipo:</Text>
                <Picker selectedValue={establishment.status} style={styles.picker} onValueChange={(value) => updateEstab('status', value)}>
                  <Picker.Item label="Activo" value="activo" />
                  <Picker.Item label="Inactivo" value="inactivo" />
                </Picker>
            </View>
        </View>

        <TouchableOpacity onPress={updateEstab}>
          <Text>Actualizar</Text>
        </TouchableOpacity>
    </ScrollView>

    <OverlayOptions
        visible={visible}
        onClose={() => setVisible(false)}
        image={optionType}
        color={color}
        ejecute={selectImage}
      />
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
    marginVertical: 15,
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
  },
  imgTop: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
    justifyContent: 'flex-end',
  },
  imgTopContainer: {
    width: '100%',
    justifyContent:'center',
    alignItems:'center' 
  },
  imageAccount:{
    width:150,
    height:150,
    borderRadius:100,
    justifyContent:'center',
    alignItems:'center',
    marginTop:-65,
    marginBottom:10
  }
})

