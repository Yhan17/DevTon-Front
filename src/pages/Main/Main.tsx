import React, { useEffect, useState } from 'react';
import './Main.css';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png'
import like from '../../assets/like.svg'
import dislike from '../../assets/dislike.svg'
import itsaMatch from '../../assets/itsamatch.png'
import { dislikeAnDev, getDevs, IUser, likeAnDev, logout, persistentStorage } from '../../services';
import { io } from 'socket.io-client';
import { Avatar, AvatarBadge, Box, Button, Flex, Menu, MenuButton, MenuItem, MenuList, Image, chakra, Text } from '@chakra-ui/react';

export default function Main() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [matchDev, setMatchDev] = useState<IUser>();
  const _id = persistentStorage.getItem('id')
  const _avatar = persistentStorage.getItem('image')



  useEffect(() => {
    async function loadUsers() {
      const response = await getDevs(`${_id}`)
      setUsers(response);
    };
    if (_id) {
      loadUsers();
      const url = process.env.REACT_APP_API_URL
      const socket = io(`${url}`, {
        query: {
          user: _id
        }
      })

      socket.on('match', (dev: IUser) => {
        setMatchDev(dev)
      });

      socket.on('newUser', (_) => {
        loadUsers()
      })
    }
  }, [_id])

  async function handleLike(id: string) {
    await likeAnDev(`${_id}`, id)
    setUsers(users.filter(user => user._id !== id));
  }
  async function handleDislike(id: string) {
    await dislikeAnDev(`${_id}`, id)
    setUsers(users.filter(user => user._id !== id));
  }


  return (<div className="main-container">
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
          <Link to="/dev/dislikes">
            <MenuItem>Dislikes</MenuItem>
          </Link>
          <MenuItem onClick={logout}>
            Logout
          </MenuItem>
        </MenuList>
      </Menu>
    </Flex>
    {users && users.length > 0 ? (
      <chakra.ul>
        {users.map(user => (
          <chakra.li key={user._id}>
            <Image src={user.avatar} alt="Avatar"></Image>
            <chakra.footer>
              <chakra.strong>{user.name == null ? user.user : user.name}</chakra.strong>
              <Text>{user.bio == null ? 'Sem Descrição' : user.bio}</Text>
            </chakra.footer>
            <Box className="buttons">
              <Button type="button" onClick={() => handleLike(user._id)}>
                <Image src={like} alt="like" />
              </Button>
              <Button type="button" onClick={() => handleDislike(user._id)}>
                <Image src={dislike} alt="dislike" />
              </Button>
            </Box>
          </chakra.li>
        ))}
      </chakra.ul>
    ) : (
      <div className="empty">Acabou :(</div>
    )}
    {
      matchDev && (
        <div className="match-container">
          <Image src={itsaMatch} alt="" />
          <Image className="avatar" src={matchDev.avatar} alt="" />
          <strong>{matchDev.name == null ? matchDev.user : matchDev.name}</strong>
          <p>
            {matchDev.bio == null ? 'Sem Descrição' : matchDev.bio}
          </p>

          <button type="button" onClick={() => setMatchDev(undefined)}>Fechar</button>
        </div>
      )
    }
  </div>
  );
}