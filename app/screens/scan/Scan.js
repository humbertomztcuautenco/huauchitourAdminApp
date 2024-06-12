import React,{ useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View , Alert, SafeAreaView, Platform, Image, Animated} from 'react-native';
import { Camera } from 'expo-camera';
import { useFocusEffect, useNavigation} from '@react-navigation/native';
import { useIsFocused } from '@react-navigation/native';
import Constants from 'expo-constants';

const Scan = () => {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const navigation = useNavigation();
    const focused = useIsFocused();

    useFocusEffect(
      useCallback(() => {
        (async ()=>{
          setScanned(false)
          const { status } = await BarCodeScanner.requestPermissionsAsync();
          setHasPermission(status === 'granted');
          const camaraStatus = await Camera.requestCameraPermissionsAsync();
          setHasPermission(camaraStatus.status === 'granted');
        })()
      },[])
    );

    const handleBarCodeScanned = ({ type, data }) => {
      setScanned(true);
      navigation.navigate("qr",{data});
    };
  
    if (hasPermission === null) {
      return <Text style={styles.centrarTexto} allowFontScaling={false}>No hay acceso a la cámara, otorga los permisos nesesarios para poder usar la cámara.</Text>;
    }
    if (hasPermission === false) {
      return <Text style={styles.centrarTexto} allowFontScaling={false}>No hay acceso a la cámara, otorga los permisos nesesarios para poder usar la cámara.</Text>;
    }
  
    return (
      <View style={styles.container}>
        {focused && (
            <Camera
            key={scanned ? 1 : 2}
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={{width: '125%', height: "100%", alignItems: 'center', justifyContent: 'center'}}
          >
            <View style={styles.containerIcons}>
              <View style={styles.textBox}>
                <Text allowFontScaling={false} style={{fontSize: 18, fontWeight: 'bold', color: '#fff', textAlign: 'center'}}>Escanea un QR de HuauchiTour</Text>
              </View>
              <Image
                resizeMode='contain'
                source={require('../../../assets/scanner.png')}
                style={styles.imageS}
              />
            </View>
          </Camera>
        )}
      </View>
    );
}

export default Scan

const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      backgroundColor: '#fff',
      alignItems:'center', 
      justifyContent: 'center',
      height : '100%',
      width : '100%',
      paddingTop: Platform.OS == 'ios' ? Constants.statusBarHeight : 0
    },
    containerIcons: {
      width: '100%', 
      height: '100%',
      alignItems:'center'
    },
    textBox: {
      backgroundColor: '#00000070',
      borderRadius: 25,
      width: '60%', 
      height: 70,
      justifyContent: 'center',
      marginVertical: '20%'
    }, 
    imageS: {
      height: 300
    },
    centrarTexto: {
      alignSelf: 'center',
      marginTop: '100%',
      fontSize: 20,
      fontWeight: 'bold',
      textAlign: 'center',
      marginHorizontal: '10%'
    }
  });
