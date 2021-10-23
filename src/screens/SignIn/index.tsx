import React, { useState } from 'react';
import {
  Container,
  Header,
  TittleWrapper,
  Title,
  SignInTitle,
  Footer,
  FooterWrapper
} from './styles';

import AppleSvg from '../../assets/apple.svg';
import GoogleSvg from '../../assets/google.svg';
import LogoSvg from '../../assets/logo.svg';
import { RFValue } from 'react-native-responsive-fontsize';
import { SignInSocialButton } from '../../components/SignInSocialButton';
import { useAuth } from '../../hooks/auth';
import { ActivityIndicator, Alert, Platform } from 'react-native';
import { useTheme } from 'styled-components';

export function SignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const { signInWithGoogle, signInWithApple } = useAuth();

  async function handleSignInWithGoogle() {
    try {
      setIsLoading(true);
      return await signInWithGoogle();
    } catch (err) {
      console.log(err);
      Alert.alert('Não foi possível conectar a conta Google');
      setIsLoading(false);
    }
  };

  async function handleSignInWithApple() {
    try {
      setIsLoading(true);
      return await signInWithApple();
    } catch (err) {
      console.log(err);
      Alert.alert('Não foi possível conectar a conta Apple');
      setIsLoading(false);
    }
  };

  const theme = useTheme();

  return (
    <Container>
      <Header>
        <TittleWrapper>
          <LogoSvg
            width={RFValue(120)}
            height={RFValue(68)}
          />

          <Title>
          Controle suas{'\n'}
          finanças de forma{'\n'}
          muito simples
          </Title>
        </TittleWrapper>

        <SignInTitle>
        Faça seu login com{'\n'}
        uma das contas abaixo
        </SignInTitle>
      </Header>

      <Footer>
        <FooterWrapper>
          <SignInSocialButton
            svg={GoogleSvg}
            title="Entrar com Google"
            onPress={handleSignInWithGoogle}
          />
          {Platform.OS === 'ios' && (
            <SignInSocialButton
              svg={AppleSvg}
              title="Entrar com Apple"
              onPress={handleSignInWithApple}
            />
          )}
        </FooterWrapper>

        {isLoading && 
        <ActivityIndicator
          color={theme.colors.shape}
          style={{ marginTop: 18 }}
        />}
      </Footer>
    </Container>
  )
}