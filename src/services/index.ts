import { PersistentStorage } from "persistor-node";
import api from "../http";

interface IUser {
  _id: string,
  name: string,
  user: string,
  bio: string,
  avatar: string,
  isFirstTime: boolean,
  languages: string[],
}

export const persistentStorage = PersistentStorage.getOrCreate('user', { storage: localStorage })

export const login = async (username: string) => {
  try {
    const { data } = await api.post<IUser>('/dev', {
      username
    })

    return data
  } catch (e) {
    console.warn(e)
  }
}
export const registerTechs = async (user: string, techs: string[]) => {
  try {
    const { data } = await api.post<IUser>('/dev/techs', {
      techs
    }, { headers: { user } })

    return data
  } catch (e) {
    console.warn(e)
  }
}