import React from 'react'
import { StyleSheet, Text, ScrollView} from 'react-native'
import { ListItem,Icon } from 'react-native-elements';

const ListPromosUsadas = (props) => {
    const {listPromos}  = props;

    return (
        <ScrollView>
           {
               listPromos.map((item,i) => (
                    <ListItem key = {i} >
                        <Icon name='qrcode'
                              type='font-awesome' 
                        />
                        <ListItem.Content>
                        <ListItem.Title>{item.TituloPromo}: {item.DescripcionPromo}</ListItem.Title>
                        <ListItem.Subtitle> {item.Usuario} - {item.Fecha}</ListItem.Subtitle>
                        </ListItem.Content>
                    </ListItem>
               ))
           }
        </ScrollView>
    )
}

export default ListPromosUsadas

const styles = StyleSheet.create({})
