import SaveIcon from '@mui/icons-material/Save';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import LoadingButton from '@mui/lab/LoadingButton';
import React, { Reducer, useContext, useMemo, useReducer, useState } from 'react';
import { LayoutContextValue } from '@types';

export const LayoutContext = React.createContext<LayoutContextValue>({} as LayoutContextValue);
export const useLayoutContext = () => {
  const context = useContext(LayoutContext);
  return context;
};

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const value = useMemo(() => ({ sidebarOpen, setSidebarOpen }), [sidebarOpen]);

  return <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>;
}
