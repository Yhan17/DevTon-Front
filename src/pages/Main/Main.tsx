import React, { useEffect, useState } from 'react';
import './Main.css';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png'
import like from '../../assets/like.svg'
import dislike from '../../assets/dislike.svg'
import itsamatch from '../../assets/itsamatch.png'
import { dislikeAnDev, getDevs, IUser, likeAnDev, persistentStorage } from '../../services';
import { io } from 'socket.io-client';
import { Flex } from '@chakra-ui/react';

export default function Main() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [matchDev, setMatchDev] = useState<IUser>();
  const _id = persistentStorage.getItem('id')
  useEffect(() => {
    async function loadUsers() {
      const response = await getDevs(`${_id}`)
      setUsers(response);
    };
    if (_id) {
      loadUsers();
    }
  }, [_id]);

  useEffect(() => {

    if (_id) {
      const url = process.env.REACT_APP_API_URL
      const socket = io(`${url}`, {
        query: {
          user: _id
        }
      })

      socket.on('match', (dev: IUser) => {
        setMatchDev(dev)
      });
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
    <Flex justifyContent="flex-start" flexDirection="column" gap={2} >
      <Link to="/">
        <img src={logo} alt="DevTon" className='logoMain' />
      </Link>
    </Flex>
    {users.length > 0 && users ? (
      <ul>
        {users.map(user => (
          <li key={user._id}>
            <img src={user.avatar} alt="Avatar"></img>
            <footer>
              <strong>{user.name == null ? user.user : user.name}</strong>
              <p>{user.bio == null ? 'Sem Descrição' : user.bio}</p>
            </footer>
            <div className="buttons">
              <button type="button" onClick={() => handleLike(user._id)}>
                <img src={like} alt="like" />
              </button>
              <button type="button" onClick={() => handleDislike(user._id)}>
                <img src={dislike} alt="dislike" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    ) : (
      <div className="empty">Acabou :(</div>
    )}
    {
      matchDev && (
        <div className="match-container">
          <img src={itsamatch} alt="" />
          <img className="avatar" src={matchDev.avatar} alt="" />
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