import ReactNativeBiometrics from 'react-native-biometrics';
import { Alert } from 'react-native';

export const authenticateBiometrics = async (promptMessage: string): Promise<boolean> => {
    try {
      const { available } = await ReactNativeBiometrics.isSensorAvailable();
      if (!available) {
        Alert.alert('Error', 'Biometric sensor not available or not configured.');
        return false;
      }

      const { success } = await ReactNativeBiometrics.simplePrompt({ promptMessage });
      return success;
    } catch (error) {
      console.error('Biometric authentication error:', error);
      Alert.alert('Error', 'Biometric authentication failed.');
      return false;
    }
  };
