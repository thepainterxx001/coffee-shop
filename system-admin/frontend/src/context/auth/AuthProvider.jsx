import { useState } from "react"
import authContext from "./authContext"

const AuthProvider = ({ children }) => {
  const [ authenticated, setAuthenticated ] = useState(false);

  return (
    <authContext.Provider value={{ authenticated }}>
      { children }
    </authContext.Provider>
  )
}

export default AuthProvider