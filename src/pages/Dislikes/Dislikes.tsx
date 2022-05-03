import { Avatar, AvatarBadge, Box, Flex, Menu, MenuButton, MenuItem, MenuList, Tag, TagLabel, Text, Image } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import logo from '../../assets/logo.png'
import { getDislikedDevs, IUser, logout, persistentStorage } from "../../services";

export default function Dislikes() {
  const [devs, setDevs] = useState([])
  useEffect(() => {
    const _id = persistentStorage.getItem('id')
    async function loadDevs() {
      const response = await getDislikedDevs(`${_id}`)
      if (response)
        setDevs(response);
    };

    if (_id)
      loadDevs()
  }, [])
  const _avatar = persistentStorage.getItem('image')
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
            <Link to="/dev/likes">
              <MenuItem>
                Likes
              </MenuItem>
            </Link>
            <MenuItem>Dislikes</MenuItem>
            <MenuItem onClick={logout}>
              Logout
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>
      <Text fontSize='xl' mb="12">Lista de Devs Recusados</Text>

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
      </Box>) : (<div className="empty">Ih alá o cara não tem rixa com ninguém</div>)}
    </div >
  );
}