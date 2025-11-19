import { createContext, useState, useContext } from 'react';

export const ROLES = {
  ADMIN: 'ADMINISTRACION',
  WAREHOUSE: 'ALMACEN'
};

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [role, setRole] = useState(ROLES.ADMIN);

  return (
    <UserContext.Provider value={{ role, setRole }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);