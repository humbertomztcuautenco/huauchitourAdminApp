import React,{useState} from 'react'
import { StyleSheet, Text, View, ScrollView} from 'react-native'
import { ListItem, } from 'react-native-elements';
import RadioButtonGroup, { RadioButtonItem } from 'expo-radio-button'

const ListPromos = (props) => {
    const {promos,promoSelect,setPromoSelect} = props;
    
    return (
        <ScrollView overScrollMode='never'>
            {
                promos.map((item,i)=>(
                    <ListItem key={i}
                        onPress={ () =>{
                            setPromoSelect(item.id)
                        }}
                    >
                        <RadioButtonItem value={item.id}
                            selected={promoSelect} 
                            onSelected={(value) => setPromoSelect(value)} 
                            radioBackground="#8CCF30"
                            label={''}
                        >
                        </RadioButtonItem>
                        <ListItem.Content>
                        <ListItem.Title>{item.Titulo}</ListItem.Title>
                        <ListItem.Subtitle>{item.Descripcion}</ListItem.Subtitle>
                        </ListItem.Content>
                    </ListItem>
                ))
            }
        </ScrollView>
    )
}

export default ListPromos

const styles = StyleSheet.create({})
