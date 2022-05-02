import * as React from "react"
import './App.css'
import {
  ChakraProvider,
  theme,
} from "@chakra-ui/react"
import Router from './routes'

export const App = () => (
  <ChakraProvider theme={theme}>
    <Router></Router>
  </ChakraProvider>
)
