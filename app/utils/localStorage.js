import * as SecureStore from 'expo-secure-store';

async function saveValue(key, value) {
    await SecureStore.setItemAsync(key, value);
}
  
async function getValueFor(key) {
    let result = await SecureStore.getItemAsync(key);
    if (result) {
       return result;
    } else {
        return false;
    }
}

async function deleteValue(key) {
    await SecureStore.deleteItemAsync(key);
}

export {saveValue,getValueFor,deleteValue}