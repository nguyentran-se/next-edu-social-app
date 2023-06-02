import React, { useContext, useMemo, useState } from 'react';
// import { AuthContextValue } from '@types';
interface AuthContextValue {
  verifiedEmail: string;
  setVerifiedEmail: React.Dispatch<React.SetStateAction<string>>;
}
export const AuthContext = React.createContext<AuthContextValue>({} as AuthContextValue);
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  return context;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [verifiedEmail, setVerifiedEmail] = useState<string>('');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const value = useMemo(() => ({ verifiedEmail, setVerifiedEmail }), [verifiedEmail]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
