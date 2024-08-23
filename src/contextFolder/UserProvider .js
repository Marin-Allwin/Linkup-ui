import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [userData, setUserData] = useState(null);
    const [refresh, setRefresh] = useState(true)

    return (
      <UserContext.Provider value={{ userData, setUserData ,refresh, setRefresh }}>
        {children}
      </UserContext.Provider>
    );
  };
  
export const useUserContext = () => useContext(UserContext);