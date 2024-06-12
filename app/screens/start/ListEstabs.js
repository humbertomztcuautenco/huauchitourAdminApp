import React,{useEffect} from 'react'
import { StyleSheet, View, ScrollView, Alert, ImageBackground, Linking, TouchableOpacity, Platform } from 'react-native';
import {ListItem,Icon,Text} from "react-native-elements";
import {AuthContext} from '../../utils/context';
import Constants from 'expo-constants';
import { Ionicons } from '@expo/vector-icons';

const ListEstabs = (props) => {
    const {navigation, route} = props;
    const {token,estabs,id} = route.params;
    
    const  {sigin} = React.useContext(AuthContext);

    const handlePress = async () => {
        await Linking.openURL("mailto: correo@correo.com");
    }

    const selectEstab = (idEstablecimiento,NombreEstab) => {
        Alert.alert(
            "Ingresar",
            "¿Estás seguro de seleccionar este establecimiento?",
            [
              {
                text: "Cancelar",
                onPress: () => console.log("Cancelado"),
                style: "cancel"
              },
              { text: "Seleccionar", onPress: () => {
                    let textJson = global.atob(token);
                    let infoUser = JSON.parse(textJson);
                    infoUser.data.NombreEstab = NombreEstab;
                    infoUser.data.idEstab = idEstablecimiento;
                    let json = JSON.stringify(infoUser);
                    let newtoken = global.btoa(json);
                    sigin(newtoken,id)
              } }
            ]
          );
    };
    
    return (
        <View style={styles.cuerpo} >
            <TouchableOpacity style={{margin: 15}} onPress={()=> navigation.navigate('login')}>
                <Ionicons 
                    name="arrow-back"
                    size={40}
                />
            </TouchableOpacity>
            <Text style={{marginLeft:15,marginRight:15, marginBottom: 15}} h4>Selecciona un establecimiento:</Text>
            
            {estabs.length > 0 ? 
                <ScrollView
                  overScrollMode='never'
                >
                    {
                        estabs.map((l, i) => (
                        <ListItem key={i} bottomDivider onPress = {()=>selectEstab(l.id,l.nombre)}>
                            <Icon raised
                                  name='sign-in'
                                  type='font-awesome'/>
                            <ListItem.Content>
                            <ListItem.Title>{l.nombre}</ListItem.Title>
                            </ListItem.Content>
                            <ListItem.Chevron />
                        </ListItem>
                        ))
                    }
                </ScrollView>
                :
                <View style={styles.noEstablishments}>
                    <ImageBackground style={{alignSelf: 'center', width: 100, height: 100, margin: 30}} resizeMode="cover" source={require('../../../assets/htlogo.png')}></ImageBackground>
                    <Text style={{textAlign: 'center', marginHorizontal: 40, fontSize: 20}} allowFontScaling={false}>{"Aun no tienes asignado ningun establecimiento. Por favor contactate con soporte:" + "\n" + "\n"}
                        <Text 
                        allowFontScaling={false}
                        style={{
                            fontWeight: 'bold',
                            textDecorationLine: 'underline',
                            fontSize: 24
                          }} 
                          onPress={() => handlePress()}>
                            correo@correo.com
                        </Text>
                    </Text>
                </View>
            }
        </View>
    );
}

export default ListEstabs;


const styles = StyleSheet.create({
    cuerpo:{
        justifyContent:'center',
        flexDirection: 'column',
        paddingTop: Platform.OS == 'ios' ? Constants.statusBarHeight : 0,
        justifyContent: 'flex-start',
        backgroundColor : '#fff',
        height:'100%'
    },
    noEstablishments: {
        width: "100%",
        height: "100%"
    }
})
