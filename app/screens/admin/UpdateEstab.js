import React, { useCallback, useState } from 'react'
import { Text, View,  StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, ImageBackground, Image } from 'react-native'
import { useSelector, useDispatch } from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Parser } from 'htmlparser2';
import { deselectEstab } from '../../features/selectEstab/selectEstabSlice';
import { Picker } from '@react-native-picker/picker';
import Api from '../../utils/Api';
import { useFocusEffect } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';



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
const [imageUri, setImageUri] = useState(null);
const [estab, setEstab] = useState({})
const [establishment, setEstablishment] = useState({
      // calificacion: estab.calificacion,
      // centroAutorizado: estab.centroAutorizado,
      // descripcion: estab.descripcion,
      // direccion: estab.direccion,
      // id: estab.id,
      // idPersona: estab.idPersona,
      // info: estab.info,
      // latitud: estab.latitud,
      // longitud: estab.longitud,
      // nombre: estab.nombre,
      // status: estab.status,
      // telefono: estab.telefono,
      // tipo: estab.tipo,
      // urlImg: estab.urlImg,
      // urlImgPerfil: estab.urlImgPerfil
    
});
const [rating, setRating] = useState(0);
const [loading, setLoading] = useState(true);
const [text, setText] = useState(null);
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
          //console.log(res.result.info)
          //setLoading(true);
        } else if (res.result === 401) {
          console.log('server error')
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    consultEstab();
  }, [token, setEstab])
);

const handleRating = (newRating) => {
  setRating(newRating);
};

const selectImage = () => {
  const options = {
    mediaType: 'photo',
    includeBase64: false,
  };

  try {
    console.log('pepo')
    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const uri = response.assets[0].uri;
        setImageUri(uri);
        uploadImage(uri);
      }
    });
  } catch (error) {
    console.error(error)
  }

  
};

return (
<View style={styles.container}>
    <ScrollView contentContainerStyle={styles.scrollContainer}>

    {loading && (
        <View style={styles.imgTopContainer}>
        <ImageBackground source={require('../../../assets/loadImage.jpeg')} style={styles.imgTop}></ImageBackground>
        <Image style={styles.imageAccount} source={require('../../../assets/loadImage.jpeg')}/>
      </View>
      )}

    <View style={styles.imgTopContainer}>
          <ImageBackground source={{uri: estab.urlImg}} style={styles.imgTop}></ImageBackground>
          <Image onLoad={() => setLoading(false)} style={styles.imageAccount} source={{uri: estab.urlImgPerfil}}/>
        </View>

      <TouchableOpacity onPress={returnEstab}>
        <Text>atras</Text>
      </TouchableOpacity>
        <View>
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

            <View style={styles.inputContainer}>
              <TouchableOpacity onPress={selectImage}>
                <Text>Seleccionar foto</Text>
              </TouchableOpacity>
              {imageUri && <Image source={{uri: estab.urlImgPerfil}} style={{ width: 100, height: 100 }} />}
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

