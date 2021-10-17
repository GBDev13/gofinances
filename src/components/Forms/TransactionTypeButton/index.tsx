import React from 'react';
import { TouchableOpacityProps } from "react-native";
import { Container, Title, Icon } from "./styles";

interface Props extends TouchableOpacityProps {
  title: string;
  type: 'up' | 'down';
  isActive: boolean;
}

const icons = {
  up: 'arrow-up-circle',
  down: 'arrow-down-circle'
};

export function TransactionTypeButton({ title, type, isActive, ...rest }: Props) {
  return (
    <Container {...rest} isActive={isActive} type={type}>
      <Icon name={icons[type]} type={type} />
      <Title>
        {title}
      </Title>
    </Container>
  )
}