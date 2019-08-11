import React, { useState } from 'react';

export const AuthContext = React.createContext({
  isAuth: false,
  login: () => {}
});

const AuthContextProvider = props => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const loginHandle = () => {
    setIsAuthenticated(true);
  };
  return (
    <AuthContext.Provider
      value={{ isAuth: isAuthenticated, login: loginHandle }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
