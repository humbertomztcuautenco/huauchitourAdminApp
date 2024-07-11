import { useNavigation } from '@react-navigation/native';
import {CameraView, useCameraPermissions } from 'expo-camera';
import { CameraType } from 'expo-camera/build/legacy/Camera.types';
import { useState, useCallback, useEffect } from 'react';
import { Alert, Button, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';

export default function ScanNewVersion() {
  const [permission, requestPermission] = useCameraPermissions();
  const [type, setType] = useState(CameraType.back)
  const [scanned, setScanned] = useState(false);
  const navigation = useNavigation();

  if(!permission){
    return(
      <View></View>
    )
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <View style={styles.alert}>
          <Text style={{ fontSize:23 }}>No hay acceso a la camara, otorga los permisos necesarios para poder usar la camara.</Text>
          <TouchableOpacity onPress={requestPermission} style={styles.btnSuccess}>
            <Text style={{fontSize:22, fontWeight:'700'}}>Aceptar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    navigation.navigate("qr",{data});
  };

  return (
    <View style={styles.container2}>
      <CameraView style={styles.camera} type={type} onBarcodeScanned={scanned ? undefined : handleBarCodeScanned} >
        
        <View style={styles.scan}>
        <View style={styles.header}>
          <Text style={{fontSize:20,color:'white'}}>Escanea un QR de HuauchiTour</Text>
        </View>
          <Image source={require('../../../assets/image.png')} style={styles.imgScanner}/>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'white'
  },
  container2:{
    flex:1
  },
  alert:{
    width: '80%',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 30,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 10,
    alignItems: 'center',
    paddingBottom:50,
    paddingTop:20,
    paddingHorizontal:12
  },
  camera: {
    flex: 1,
  },
  scan: {
    flex: 1,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor: 'transparent',
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  imgScanner:{
    width:'60%',
    height:'30%'
  },
  header:{
    justifyContent:'center',
    alignItems:'center',
    marginBottom:30,
    backgroundColor:'rgba(0,0,0,0.5)',
    padding:15,
    borderRadius:20
  },
  btnSuccess:{
    position:'absolute',
    bottom:15,
    right:20
  }
});
