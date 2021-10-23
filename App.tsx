import 'intl';
import 'intl/locale-data/jsonp/pt-BR';

import React from 'react';
import { ThemeProvider } from 'styled-components/native';
import theme from './src/global/styles/theme';

import { Routes } from './src/routes';

import { 
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold
} from '@expo-google-fonts/poppins';
import AppLoading from 'expo-app-loading';
import { StatusBar } from 'react-native';
import { AuthProvider } from './src/hooks/auth';

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold
  });


  if(!fontsLoaded) {
    return <AppLoading />
  }

  return (
    <ThemeProvider theme={theme}>
      <StatusBar barStyle="light-content"/>
      <AuthProvider>
        <Routes />
      </AuthProvider>
    </ThemeProvider>
  )
}
