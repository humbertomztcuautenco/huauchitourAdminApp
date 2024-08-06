import { Input, Text } from "react-native-elements";
import { Image, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { Picker } from '@react-native-picker/picker';
import { useState } from "react";
import Api from "../../utils/Api";
import { useSelector } from "react-redux";
import Loader from "../../components/Loader";
import { color } from 'react-native-elements/dist/helpers';
import { MaterialIcons } from "@expo/vector-icons";

const SellMembership = () => {

    const { token, } = useSelector(state => state.auth)
    const selectedEstablishment = useSelector((state) => state.selectEstab);

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)
    const [memberData, setMemberData] = useState({
        correo: '',
        plan: '0'
    })
    const [selectedValue, setSelectedValue] = useState('0')
    const [message, setMessage] = useState([

    ])

    console.log(memberData)

    const updatePlan = (key, value) => {
        setMemberData({
            ...memberData,
            [key]: value
        })

        setSelectedValue(value)
    }

    const handleChange = (value) => {
        setMemberData({
            ...memberData,
            correo: value
        })
    }

    const handleSubmit = async () => {
        setLoading(true)
        const api = new Api('membership/add', 'POST', memberData, token)
        const res = await api.call();
        console.log(res)
        if (res.response) {
            setLoading(false)
            setError(false)
            setMemberData({
                correo: '',
                plan: 0
            })
            const email = res.message.split(':')

            setMessage(email)
            setLoading(false)
        } else {
            setError(true)
            setErrorMessage(res.errors)
        }

        setLoading(false)
    }

    const color = selectedEstablishment.selectedEstab.color
    return (

        loading ? <Loader text='Validando...' /> :
            <View style={styles.container}>
                <View style={[styles.backgroundTop, { backgroundColor: color }]}>
                    {selectedEstablishment.selectedEstab ? (
                        <Text style={styles.estab}>{selectedEstablishment.selectedEstab.name} </Text>
                    ) : (
                        <Text style={styles.estab}>Perfil</Text>
                    )}
                </View>
                <View style={styles.body}>
                    <Image style={styles.imageAccount} source={require('../../../assets/topHome.jpg')} />
                    <Text style={{ fontSize: 25, fontWeight: '600' }}>Vender membresia</Text>

                    <View style={styles.inputContainer}>
                        <Text style={styles.textInput}>Correo</Text>
                        <View style={[styles.inputSearch, { borderColor: color }]}>
                            <TextInput placeholder='Correo' style={{ width: '90%' }} onChangeText={handleChange} value={memberData.correo} ></TextInput>

                        </View>
                        <Text style={styles.textInputMessage}>Plan</Text>
                        <Picker selectedValue={selectedValue} onValueChange={(value) => updatePlan('plan', value)}>
                            <Picker.Item label="Estandar" value="1" />
                            <Picker.Item label="Premium" value="2" />
                        </Picker>
                    </View>


                    <View style={styles.buttonsContainer}>
                        <View style={styles.messages}>
                            {error && <Text style={{ color: 'red', fontSize: 20, fontWeight: 'bold' }}>{errorMessage}</Text>}
                            {message && <Text style={{ color: 'green', fontSize: 17, fontWeight: 'bold', textAlign: 'center', }}>{message[0]} <Text style={{ color: 'black', fontSize: 17, fontWeight: 'bold' }}>{message[1]}</Text></Text>}
                            <TouchableOpacity style={styles.buttonSuccess}>
                                <Text style={styles.buttonText} onPress={handleSubmit}>Comprar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                </View>
            </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        //justifyContent:'center'
    },
    backgroundTop: {
        width: '100%',
        backgroundColor: color,
        height: 240,
        justifyContent: 'center',
        alignItems: 'center'
    },
    body: {
        width: '100%',
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        marginTop: -20

    },
    inputSearch: {
        width: '85%',
        flexDirection: 'row',
        borderRadius: 20,
        padding: 3,
        paddingLeft: 10,
        paddingRight: 10,
        justifyContent: 'space-between',
        borderWidth: 1.5
    },
    inputContainer: {
        marginVertical: 15
    },
    imageAccount: {
        width: 150,
        height: 150,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: -65,
        marginBottom: 10
    },
    textInput: {
        fontWeight: 'bold',
        fontSize: 23,
        marginBottom: 10,
        marginLeft: 8
    },
    textInputMessage: {
        fontWeight: 'bold',
        fontSize: 23,
        marginBottom: 10,
        marginLeft: 8,
        marginTop: 20
    },
    estab: {
        fontSize: 30,
        fontWeight: '800'
    },
    buttonSuccess: {
        paddingVertical: 10,
        paddingHorizontal: 60,
        borderRadius: 30,
        marginBottom: 20,
        marginTop: 20,
        backgroundColor: '#90cd2e'
    },
    buttonDelete: {
        paddingVertical: 10,
        paddingHorizontal: 60,
        borderRadius: 30,
        backgroundColor: 'red',
        marginBottom: 20
    },
    buttonText: {
        fontSize: 20,
        fontWeight: '600',
        color: 'white'
    },
    messages: {
        width: '70%',
        justifyContent: 'center',
        textAlign: 'center',
        alignItems: 'center',

    }
})

export default SellMembership;