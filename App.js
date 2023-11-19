import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, Text, SafeAreaView, TouchableOpacity, BackHandler } from 'react-native';
import { WebView } from 'react-native-webview';
import { usePreventScreenCapture } from 'expo-screen-capture';

const App = () => {
  usePreventScreenCapture();
  const webViewRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(loadingTimer);
  }, []);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (canGoBack && webViewRef.current) {
        webViewRef.current.goBack();
        return true; 
      } else {
        return false; 
      }
    });

    return () => backHandler.remove();
  }, [canGoBack]);

  const handleWebViewError = () => {
    setError(true);
    setLoading(false);
  };

  const handleWebViewLoad = () => {
    setLoading(false);
  };

  const reloadWebView = () => {
    if (webViewRef.current) {
      setError(false);
      setLoading(true);
      webViewRef.current.reload();
    }
  };

  const onNavigationStateChange = (navState) => {
    setCanGoBack(navState.canGoBack);
  };

  const goBackInWebViewHistory = () => {
    if (webViewRef.current) {
      webViewRef.current.goBack();
    }
  };

  const renderErrorPage = () => (
    <View style={styles.errorContainer}>
      <Text>The content couldn't be loaded at the moment. Please try again later.</Text>
      <TouchableOpacity onPress={reloadWebView}>
        <Text style={styles.retryButton}>Retry</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.navBar}>
        <TouchableOpacity onPress={goBackInWebViewHistory}>
         
        </TouchableOpacity>
        {error && (
          <TouchableOpacity onPress={reloadWebView}>
            <Text style={styles.retryButton}>Retry</Text>
          </TouchableOpacity>
        )}
      </View>
      {error ? (
        renderErrorPage()
      ) : (
        <WebView
          ref={webViewRef}
          source={{ uri: 'https://elbirony.com/' }}
          style={styles.webview}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          allowsFullscreenVideo={true} // Add this line
          onLoad={handleWebViewLoad}
          onError={handleWebViewError}
          onNavigationStateChange={onNavigationStateChange}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 16,
    paddingVertical: 5,
  },
  navBarButton: {
    color: '#007AFF',
    fontSize: 16,
  },
  title: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  retryButton: {
    color: '#007AFF',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  webview: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
});

export default App;
