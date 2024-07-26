import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LogBox, View, ActivityIndicator } from 'react-native';
import TabNavigation from './navigation/TabNavigation';
import StartStack from './navigation/StartStack';
import SelectStack from './navigation/SelectStack';
import AdminStack from './navigation/AdminStack'
import { encode, decode } from 'base-64';
import { retrieveToken } from './features/auth/authSlice';

LogBox.ignoreLogs(["Setting a timer"]);
if (!global.btoa) global.btoa = encode;
if (!global.atob) global.atob = decode;

export default function Index() {
    const dispatch = useDispatch();
    const { token } = useSelector((state) => state.auth);
    const {selectedEstab} = useSelector((state) => state.selectEstab);
    const [tipoUser, setTipoUser] = useState(null);

    useEffect(() => {
        dispatch(retrieveToken());
    }, [dispatch]);

    useEffect(() => {
        if (token) {
            let textJson = global.atob(token);
            let infoUser = JSON.parse(textJson);
            setTipoUser(infoUser.data.idTipoPersona);        
        }
    }, [token]);

    //console.log(infoUser.data.idTipoPersona)
    return (
        <>{(token != null ) ? (tipoUser == 2 ? <SelectStack /> : <AdminStack/>) : <StartStack/>}</>
    );
}