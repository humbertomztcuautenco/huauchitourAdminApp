import React, { useEffect, useRef } from 'react'
import {StyleSheet, Text, TouchableOpacity, Animated, View } from 'react-native'
import { Overlay } from 'react-native-elements'

export default function OverlayOptions({visible, onClose, image, color, ejecute}){

const fadeAnim = useRef(new Animated.Value(0)).current;

  const closeModal = () => {
    fadeOut();
    setTimeout(() => {
      onClose(false)
    }, 40);
  }

  const fadeIn = () => {
    // Will change fadeAnim value to 1 in 5 seconds
    Animated.timing(fadeAnim, {
      toValue: 0.4,
      duration: 700,
      useNativeDriver: true
    }).start();
  };

  const fadeOut = () => {
    // Will change fadeAnim value to 0 in 3 seconds
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 40,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    visible ? fadeIn() : fadeOut();   
  }, [visible])

    return (
      <Overlay
      fullScreen={true}
      isVisible={visible}
      overlayStyle={styles.container}
      animationType='slide'
      backdropStyle={{backgroundColor:'transparent'}}
    >

      <Animated.View style={[styles.fadingContainer,{opacity: fadeAnim}]}>
        <TouchableOpacity style={styles.transparent}onPress={() => closeModal()}/>
      </Animated.View>

      <View style={styles.content}>
        <View style={styles.buttons}>
          <TouchableOpacity style={[styles.button,{backgroundColor:color}]} onPress={() => ejecute(image)}>
            <Text style={{color:'white', fontSize:19, fontWeight:'bold'}}>Editar imagen {image}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button,{backgroundColor:color}]} onPress={closeModal}>
            <Text style={{color:'white', fontSize:19, fontWeight:'bold'}}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Overlay>
    
    )
  }

const styles = StyleSheet.create({
  transparent: {
    width: '100%',
    height: '100%',
    backgroundColor:'black',
  },
  fadingContainer: {
    padding: 0,
    width: '100%',
    height: '100%',
  },
  container: {
    backgroundColor: 'transparent',
    padding: 0,
    elevation: 0,
  },
  buttons:{
    width:'100%',
    justifyContent:'center',
    alignItems:'center',
    paddingVertical:20
  },
  content:{
    width:'100%',
    flex:1,
    backgroundColor:'white',
    position:'absolute',
    bottom:0,
    borderTopLeftRadius:20,
    borderTopRightRadius:20
  },
  button:{
    width:'80%',
    borderRadius:30,
    padding:20,
    marginVertical:10,
    justifyContent:'center',
    alignItems:'center'
  }
})


