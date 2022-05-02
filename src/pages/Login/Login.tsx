import React, { useState } from "react";
import logo from '../../assets/logo.png'
import { login } from "../../services";
import { useNavigate } from "react-router";
import './Login.css'
import { Button, Input, Flex, useToast } from "@chakra-ui/react";
import { persistentStorage } from "../../services";
import { Duration } from "persistor-node";

export default function Login() {
  const [username, setUsername] = useState('');
  const navigate = useNavigate()
  const toast = useToast()


  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();

    const response = await login(username)
    if (!response) {
      toast({
        title: 'Ocorreu um erro ao obter o usuário',
        status: 'error',
        position: 'top-right',
        isClosable: true,

      })
      return
    }
    const { _id: id, isFirstTime } = response;
    persistentStorage.setItem('id', id, { expireIn: Duration.HOUR })

    if (isFirstTime) {
      navigate(`/dev/languages`);
      return
    }
    navigate(`/dev/search`);
  }

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <img src={logo} alt="DevTon" className="logo" />
        <Flex justifyContent="center" flexDirection="column" gap={2}>
          <Input placeholder='Digite o seu usuário do github' size='lg' value={username}
            onChange={e => {
              setUsername(e.target.value)
            }} />
          <Button colorScheme='teal' variant='outline' type="submit">
            Enviar
          </Button>
        </Flex>
      </form>
    </div>
  );
}