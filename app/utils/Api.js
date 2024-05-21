import {url} from './config';
import { Alert } from 'react-native';
import * as Network from 'expo-network';

export default class Api{
    
    constructor (uri,metodo,parametros = null,token = null){
        this.url = `${url}${uri}`;
        this.metodo = metodo;
        this.parametros = parametros;
        this.token = token;
    }

        async call(){
        const network = await Network.getNetworkStateAsync();
        if (network.isConnected) {
            let init = null
            if (this.metodo == "GET") {
                init = {
                    method: this.metodo,
                    headers: {
                            'Content-Type': 'application/json',
                            'APP-TOKEN' : this.token
                        }
                }
            }else{
                init = {
                    method: this.metodo,
                    body: JSON.stringify(this.parametros), 
                    headers: {
                            'Content-Type': 'application/json',
                            'APP-TOKEN' : this.token
                        }
                }
            }
            const r = await fetch(this.url,init)
            .then(res => {
                res.status;
                if ( res.status == 200) {
                    return res.json()
                } else if (res.status == 401) {
                    return {
                        response : false,
                        result : 401
                    };
                }else{
                    return res.text()
                }
            });
            return r;
        } else {
            Alert.alert(
                "Error de conexión",
                "Verifica tu conexión a internet",
                [
                  {
                    text: "OK"
                  }
                ]
            );
            return {
                response: false,
                result: "",
                message: "",
                errors: ""
            }
        }
    }
}