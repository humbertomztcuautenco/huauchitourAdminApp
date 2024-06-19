import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LogBox, View, ActivityIndicator } from 'react-native';
import TabNavigation from './navigation/TabNavigation';
import StartStack from './navigation/StartStack';
import { encode, decode } from 'base-64';
import { retrieveToken } from './features/auth/authSlice';

LogBox.ignoreLogs(["Setting a timer"]);
if (!global.btoa) global.btoa = encode;
if (!global.atob) global.atob = decode;

export default function Index() {
    const dispatch = useDispatch();
    const { token } = useSelector((state) => state.auth);
    const {selectedEstab} = useSelector((state) => state.selectEstab);
    useEffect(() => {
        dispatch(retrieveToken());
    }, [dispatch]);

    return (
        <>{token != null ? <TabNavigation /> : <StartStack />}</>
    );
}