import React, { useState, useRef } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import { authenticateBiometrics } from '../services/biometricService';

const WebViewer: React.FC = () => {
  const [webViewUrl, setWebViewUrl] = useState('file:///android_asset/webview/test.html');
  const [showWebView, setShowWebView] = useState(false);
  const webViewRef = useRef<WebView>(null);

  const onWebViewMessage = (event: any) => {
    const { data } = event.nativeEvent;
    console.log('Message from WebView:', data);
    if (data === 'signTransactionRequest') {
      Alert.alert(
        'Transaction Request',
        'A transaction signing request was received from the WebView. Authenticate to approve.',
        [
          {
            text: 'Cancel',
            onPress: () => {
              webViewRef.current?.postMessage('Transaction Rejected');
            },
            style: 'cancel',
          },
          {
            text: 'Approve',
            onPress: async () => {
              const authenticated = await authenticateBiometrics('Approve transaction from WebView');
              if (authenticated) {
                webViewRef.current?.postMessage('Transaction Approved: Simulated Signature');
              } else {
                webViewRef.current?.postMessage('Transaction Rejected: Authentication Failed');
              }
            },
          },
        ],
      );
    }
  };

  return (
    <View style={styles.webViewContainer}>
      <Text style={styles.infoTitle}>Embedded WebView</Text>
      <TextInput
        style={styles.input}
        onChangeText={setWebViewUrl}
        value={webViewUrl}
        placeholder="Enter URL to load in WebView"
      />
      <Button title="Load URL in WebView" onPress={() => setShowWebView(true)} />
      {showWebView && (
        <View style={{ height: 300, width: '100%', marginTop: 10, borderColor: 'gray', borderWidth: 1 }}>
          <WebView
            source={{ uri: webViewUrl }}
            style={{ flex: 1 }}
            onMessage={onWebViewMessage}
            ref={webViewRef}
          />
          <Button title="Close WebView" onPress={() => setShowWebView(false)} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  webViewContainer: {
    marginTop: 20,
    padding: 10,
    borderColor: '#999',
    borderWidth: 1,
    borderRadius: 5,
  },
  infoTitle: {
    fontWeight: 'bold',
    marginTop: 15,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
  },
});

export default WebViewer;
