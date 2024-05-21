import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import {Overlay } from 'react-native-elements';


export default function Loader(props){
    const {isVisible,text} = props;

    return(
        <Overlay
            isVisible={isVisible}
            windowBackgroundColor = "rgba(0,0,0,0.5)"
            overlayBackgroundColor = "transparent"
            overlayStyle = {styles.overlay}
        >
            <View style={styles.vista}>
                <ActivityIndicator size={45} style={{marginTop:10}} color="black" />
                {/* if corto de solo return true */}
                {text && <Text style={styles.text}>{text}</Text>}
            </View>
        </Overlay>
    );
}

const styles = StyleSheet.create({
    overlay:{
        height:100,
        width:200,
        backgroundColor:"#fff",
        borderRadius:10
    },
    vista:{
        flex:1,
        alignItems: "center",
        justifyContent: "center"
    },
    text:{
        color:"black",
        fontSize : 16,
        // textTransform:"uppercase",
        marginTop: 12
    }
});