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
import { ModalAction, ModalContextValue } from '@types';

export const ModalContext = React.createContext<ModalContextValue>({} as ModalContextValue);
export const useModalContext = () => {
  const context = useContext(ModalContext);
  return context;
};
function reducer(
  state: Omit<ModalContextValue, 'dispatch'>,
  action: ModalAction,
): Omit<ModalContextValue, 'dispatch'> {
  switch (action.type) {
    case 'open':
      return {
        ...state,
        open: true,
        title: action.payload.title,
        content: action.payload.content,
        saveTitle: action.payload.saveTitle ?? 'Save',
        onConfirm: null,
        onCreateOrSave: action.onCreateOrSave,
      };
    case 'close':
      return { ...state, open: false, submitLoading: false, onCreateOrSave: null };
    case 'clear':
      return {
        ...state,
        title: 'Your Popup',
        content: null,
        onConfirm: null,
        onCreateOrSave: null,
      };
    case 'open_confirm':
      return {
        ...state,
        open: true,
        title: action.payload.title,
        content: action.payload.content,
        onConfirm: action.onConfirm,
        onCreateOrSave: null,
        confirmTitle: action.payload.confirmTitle ?? 'Deactivate',
      };
    case 'disable_action':
      return {
        ...state,
        disabledAction: action.payload,
      };
    default:
      return state;
  }
}

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer<Reducer<Omit<ModalContextValue, 'dispatch'>, ModalAction>>(
    reducer,
    {
      open: false,
      content: null,
      title: 'Deactivate this item',
      confirmTitle: 'Deactivate',
      saveTitle: 'Save',
      onConfirm: null,
      onCreateOrSave: null,
      submitLoading: false,
      disabledAction: false,
    },
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const value = useMemo(
    () => ({ ...state, open: state.open, dispatch }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [...Object.values(state), dispatch],
  );

  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>;
}

function Modal() {
  const {
    open,
    content: Content,
    dispatch,
    title,
    onConfirm,
    onCreateOrSave,
    submitLoading,
    confirmTitle,
    saveTitle,
    disabledAction = false,
  } = useModalContext();
  function handleClose() {
    dispatch({ type: 'close' });
  }

  function handleSubmit() {}
  return (
    <Dialog onClose={handleClose} open={open} PaperProps={{ sx: { overflow: 'visible' } }}>
      <DialogTitle>
        <Typography variant="h4" textAlign={'center'} fontSize={20}>
          {title}
        </Typography>
      </DialogTitle>
      <Divider />
      {/* TODO: delay unmount <Content /> */}
      <DialogContent
        sx={{ width: 600, overflow: 'visible' }}
        // TODO: Not working if pass Content is GroupForm ?
        // onAnimationEnd={(e) => {
        //   e.stopPropagation();
        //   dispatch({ type: 'clear' });
        // }}
      >
        {Content && <Content />}
      </DialogContent>
      <Divider />
      {Boolean(onConfirm) ? (
        <DialogActions>
          <Button onClick={handleClose} type="button">
            Cancel
          </Button>
          <LoadingButton
            onClick={() => {
              onConfirm && onConfirm();
            }}
            variant="contained"
            color="error"
            loading={submitLoading}
            // loadingPosition="start"
          >
            {confirmTitle}
          </LoadingButton>
        </DialogActions>
      ) : (
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button onClick={handleClose} type="button">
            Cancel
          </Button>
          <LoadingButton
            type="submit"
            form="entityForm"
            variant="contained"
            loading={submitLoading}
            // loadingPosition="start"
            disabled={disabledAction && title === 'Create post'}
            onClick={() => {
              onCreateOrSave && onCreateOrSave();
            }}
          >
            {saveTitle}
          </LoadingButton>
        </DialogActions>
      )}
    </Dialog>
  );
}

export default Modal;
