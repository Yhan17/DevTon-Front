import { Avatar, AvatarBadge, Box, Flex, Menu, MenuButton, MenuItem, MenuList, Tag, TagLabel, Text, Image } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import logo from '../../assets/logo.png'
import { getLikedDevs, IUser, logout, persistentStorage } from "../../services";

export default function Likes() {
  const [devs, setDevs] = useState([])
  const _avatar = persistentStorage.getItem('image')

  useEffect(() => {
    const _id = persistentStorage.getItem('id')
    async function loadDevs() {
      const response = await getLikedDevs(`${_id}`)
      if (response)
        setDevs(response);
    };

    if (_id)
      loadDevs()
  }, [])
  return (
    <div className="main-container">
      <Flex justifyContent="space-between" flexDirection="row" alignItems="center" gap={2} >
        <Link to="/">
          <Image src={logo} alt="DevTon" className='logoMain' />
        </Link>
        <Menu placement="bottom">
          <MenuButton>
            <Avatar name='User' src={`${_avatar}`} size="lg" >
              <AvatarBadge boxSize='1.25em' bg='green.500' />
            </Avatar>
          </MenuButton>
          <MenuList>
            <MenuItem>
              Likes
            </MenuItem>
            <Link to="/dev/dislikes">
              <MenuItem>Dislikes</MenuItem>
            </Link>
            <MenuItem onClick={logout}>
              Logout
            </MenuItem>
          </MenuList>
        </Menu>

      </Flex>
      <Text fontSize='xl' mb="12">Lista de Devs Favoritados</Text>

      {devs && devs.length > 0 ? (<Box w="full">
        {devs.map((e: IUser) =>
          <Flex w="full" >
            <Avatar name="Likes" src={e.avatar} size="lg" marginRight="6" />
            <Flex flexDir="column" alignItems="flex-start" w="full">
              <Text fontWeight="bold">{e.user}</Text>
              <Text>{e.name}</Text>
              <Flex w="full" gap="3">
                {e.languages.map(e =>
                  <Tag size='md' colorScheme='teal' borderRadius='full'>
                    <TagLabel>{e}</TagLabel>
                  </Tag>
                )}</Flex>
            </Flex>
          </Flex>)}
      </Box>) : (<div className="empty">Nenhum Like encontrado, vai socializar pô</div>)}
    </div>
  );
}