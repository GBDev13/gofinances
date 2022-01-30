import React, { useState } from 'react';
import {
  Keyboard,
  Modal,
  TouchableWithoutFeedback,
  Alert
} from 'react-native';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import { useNavigation } from '@react-navigation/native';

import { Button } from '../../components/Forms/Button';
import { CategorySelectButton } from '../../components/Forms/CategorySelectButton';
import { InputForm } from '../../components/Forms/InputForm';
import { TransactionTypeButton } from '../../components/Forms/TransactionTypeButton';
import { CategorySelect } from '../CategorySelect';
import {
  Container,
  Header,
  Title,
  Form,
  Fields,
  TransactionTypes
} from './styles';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../hooks/auth';

interface FormData {
  name: string;
  amount: string;
};

const schema = Yup.object().shape({
  name: Yup
  .string()
  .required('Nome é obrigatório'),
  amount: Yup
  .number()
  .required('O valor é obrigatório')
  .typeError('Informe um valor numérico')
  .positive('O valor não pode ser negativo')
});

type NavigationProps = {
  navigate:(screen:string) => void;
}

export function Register() {
  const [transactionType, setTransactionType] = useState('');
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);

  const { user } = useAuth();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  });

  const [category, setCategory] = useState({
    key: 'category',
    name: 'Categoria'
  });

  const navigation = useNavigation<NavigationProps>();

  function handleTransactionsTypeSelect(type: 'positive' | 'negative') {
    setTransactionType(type);
  }

  function handleCloseModal() {
    setCategoryModalOpen(false);
  }

  function handleOpenModal() {
    setCategoryModalOpen(true);
  }

  async function handleRegister(form: FormData) {
    if(!transactionType)
      return Alert.alert("Selecione o tipo da transação")

    if(category.key === 'category')
      return Alert.alert("Selecione a categoria")

    const newTransaction = {
      id: String(uuid.v4()),
      name: form.name,
      amount: form.amount,
      type: transactionType,
      category: category.key,
      date: new Date()
    };
    
    try {
      const dataKey = `@gofinances:transactions_user:${user.id}`;
      
      const data = await AsyncStorage.getItem(dataKey);
      const currentData = data ? JSON.parse(data) : [];

      const dataFormatted = [...currentData, newTransaction]

      await AsyncStorage.setItem(dataKey, JSON.stringify(dataFormatted));

      reset();
      setTransactionType('');
      setCategoryModalOpen(false);
      setCategory({
        key: 'category',
        name: 'Categoria'
      });

      navigation.navigate("Listagem");

    } catch (err) {
      console.log(err);
      Alert.alert("Não foi possível salvar");
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container>
      <Header>
        <Title>Cadastro</Title>
      </Header>

      <Form>
        <Fields>
          <InputForm
            name="name"
            control={control}
            placeholder="Nome"
            autoCapitalize="sentences"
            autoCorrect={false}
            error={errors.name && errors.name.message}
          />
          <InputForm
            name="amount"
            control={control}
            placeholder="Preço"
            keyboardType="numeric"
            error={errors.amount && errors.amount.message}
          />

          <TransactionTypes>
            <TransactionTypeButton
              type="up"
              title="Income"
              onPress={() => handleTransactionsTypeSelect('positive')}
              isActive={transactionType === 'positive'}
            />
            <TransactionTypeButton
              type="down"
              title="Outcome"
              onPress={() => handleTransactionsTypeSelect('negative')}
              isActive={transactionType === 'negative'}
            />
          </TransactionTypes>

          <CategorySelectButton
            testID="button-category"
            title={category.name}
            onPress={handleOpenModal}
          />
        </Fields>

        <Button
          title="Enviar"
          onPress={handleSubmit(handleRegister)}
        />
      </Form>

      <Modal testID="modal-category" visible={categoryModalOpen}>
        <CategorySelect
          category={category}
          setCategory={setCategory}
          closeSelectCategory={handleCloseModal}
        />
      </Modal>

    </Container>
    </TouchableWithoutFeedback>
  )
}