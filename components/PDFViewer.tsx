import React from 'react';
import { Modal, View, TouchableOpacity, StyleSheet, StatusBar, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useTheme } from './theme-provider';

interface PDFViewerProps {
  visible: boolean;
  pdfUrl: string;
  onClose: () => void;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ visible, pdfUrl, onClose }) => {
  const { theme } = useTheme();

  const renderLoading = () => (
    <View style={[styles.loadingContainer, { backgroundColor: theme.backgroundColor }]}>
      <Text style={[styles.loadingText, { color: theme.textPrimary }]}>
        Loading PDF...
      </Text>
    </View>
  );

  const renderError = () => (
    <View style={[styles.errorContainer, { backgroundColor: theme.backgroundColor }]}>
      <Icon name="exclamation-triangle" size={48} color={theme.error} />
      <Text style={[styles.errorText, { color: theme.textPrimary }]}>
        Failed to load PDF
      </Text>
      <Text style={[styles.errorSubtext, { color: theme.textSecondary }]}>
        Please check your internet connection
      </Text>
    </View>
  );

  return (
    <Modal 
      visible={visible} 
      animationType="slide" 
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Icon name="times" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>PDF Viewer</Text>
          <View style={styles.placeholder} />
        </View>

        {/* WebView */}
        <WebView 
          source={{ uri: pdfUrl }}
          style={styles.webview}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          renderLoading={renderLoading}
          renderError={renderError}
          allowsInlineMediaPlayback={true}
          mediaPlaybackRequiresUserAction={false}
          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.error('WebView error:', nativeEvent);
          }}
          onHttpError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.error('WebView HTTP error:', nativeEvent);
          }}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 10,
    backgroundColor: '#000',
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  placeholder: {
    width: 44,
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
});

export default PDFViewer; 