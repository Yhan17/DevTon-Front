import React, { useEffect, useState } from "react";
// import { persistentStorage } from "../../services";
import logo from '../../assets/logo.png'
import { Button, Flex, Text, useToast } from "@chakra-ui/react";
import './Languages.css'
import json from './github.json'
import { Autocomplete, Option } from "chakra-ui-simple-autocomplete";
import { persistentStorage, registerTechs } from "../../services";
import { useNavigate } from "react-router";

export default function Languages() {

  const [id, setId] = useState('default')
  useEffect(() => {
    const _id = persistentStorage.getItem('id')
    setId(`${_id}`)
  }, [])
  const toast = useToast()
  const navigate = useNavigate()


  const languages = json.map(e => ({ value: e, label: e }));

  const [selectedItems, setSelectedItems] = React.useState<Option[]>([]);

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    const techs = selectedItems.map(e => e.value)
    const response = await registerTechs(id, techs)

    if (!response) {
      toast({
        title: 'Ocorreu um erro ao registrar as linguagens',
        status: 'error',
        position: 'top-right',
        isClosable: true,

      })
      return
    }
    navigate(`/dev/search`);
  }

  return (
    <div>
      <Flex justifyContent="flex-start" flexDirection="column" gap={2} >
        <img src={logo} alt="DevTon" className="languageLogo" />
      </Flex>
      <Flex justifyContent='center' alignItems='center' h='80vh' flexDir="column" gap={3} >
        <Text fontSize='xl'>Adicione as linguagens que tem afinidade</Text>
        <form onSubmit={handleSubmit}>

          <Flex justifyContent="center" flexDirection="column" gap={2} w="500px">
            <Autocomplete
              options={languages}
              width="full"
              result={selectedItems}
              setResult={(options: Option[]) => setSelectedItems(options)}
              placeholder="Selecione a linguagem"
            />
            <Button colorScheme='teal' variant='outline' type="submit">
              Enviar
            </Button>
          </Flex>
        </form>
      </Flex>
    </div>
  )
}