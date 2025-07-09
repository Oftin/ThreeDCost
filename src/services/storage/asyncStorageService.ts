import AsyncStorage from "@react-native-async-storage/async-storage";

export const getAsyncStorageItem = async <T>(key: string): Promise<T | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error(`Error reading ${key} from AsyncStorage:`, e);
    return null;
  }
};

export const setAsyncStorageItem = async <T>(key: string, value: T): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    console.error(`Error saving ${key} to AsyncStorage:`, e);
    throw e;
  }
};

export const removeAsyncStorageItem = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    console.error(`Error removing ${key} from AsyncStorage:`, e);
  }
};
