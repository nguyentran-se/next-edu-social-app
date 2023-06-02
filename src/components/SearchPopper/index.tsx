import CloseIcon from '@mui/icons-material/Close';
import ScheduleIcon from '@mui/icons-material/Schedule';
import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import { TextFieldProps } from '@mui/material/TextField';
import SearchInput from 'components/SearchInput';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { LocalStorageKey, appLocalStorage } from 'utils';

type SearchPopperProps = TextFieldProps & {
  redirect: string;
};
function SearchPopper({ redirect, onChange, onFocus, onBlur, ...props }: SearchPopperProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [searchValue, setSearchValue] = useState('');
  const [searchHistories, setSearchHistories] = useState<string[]>([]);
  const open = Boolean(anchorEl);

  const router = useRouter();
  useEffect(() => {
    const histories = appLocalStorage.getList(LocalStorageKey.GroupSearch);
    setSearchHistories(histories);

    const query = router.query.q as string;
    if (query) setSearchValue(query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSearchFocus(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement, Element>) {
    setAnchorEl(e.currentTarget);
    if (onBlur) onBlur(e);
  }
  function handleSearchBlur(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement, Element>) {
    // setAnchorEl(null);
    if (onFocus) onFocus(e);
  }

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchValue(e.target.value);
    if (onChange) onChange(e);
  }

  function handleSearchForClick() {
    const newHistories = appLocalStorage.insertToList(LocalStorageKey.GroupSearch, searchValue);
    setAnchorEl(null);
    setSearchHistories(newHistories);
    router.push(`${redirect}?q=${searchValue}`);
  }

  function handleHistoryItemClick(query: string) {
    setAnchorEl(null);
    router.push(`${redirect}?q=${query}`);
  }

  function handleRemoveHistoryClick(history: string) {
    const newHistories = appLocalStorage.removeInList(LocalStorageKey.GroupSearch, history);
    setSearchHistories(newHistories);
  }
  return (
    <Box>
      <ClickAwayListener onClickAway={() => setAnchorEl(null)}>
        <Box>
          <SearchInput
            placeholder="Search group..."
            sx={{ width: 270 }}
            onFocus={handleSearchFocus}
            onBlur={handleSearchBlur}
            onChange={handleSearchChange}
            value={searchValue}
            {...props}
          />
          <Popper
            open={open}
            anchorEl={anchorEl}
            sx={{ width: 270, maxHeight: 300, minHeight: 50 }}
            placement="bottom-start"
          >
            <Paper
              sx={{
                p: 1,
                mt: 1,
                borderRadius: 2,
                minHeight: '30px',
                boxShadow:
                  'rgba(0, 0, 0, 0.07) 0px 1px 2px, rgba(0, 0, 0, 0.07) 0px 2px 4px, rgba(0, 0, 0, 0.07) 0px 4px 8px, rgba(0, 0, 0, 0.07) 0px 8px 16px, rgba(0, 0, 0, 0.07) 0px 16px 32px, rgba(0, 0, 0, 0.07) 0px 32px 64px',
              }}
            >
              <List>
                {searchHistories.map((query, index) => (
                  <ListItem
                    key={index}
                    sx={{
                      cursor: 'pointer',
                      ':hover': { backgroundColor: 'rgba(68, 73, 80, 0.15)' },
                      borderRadius: 1,
                    }}
                    onClick={() => handleHistoryItemClick(query)}
                    secondaryAction={
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        size="small"
                        sx={{ borderRadius: '50% !important' }}
                        onClick={() => handleRemoveHistoryClick(query)}
                      >
                        <CloseIcon />
                      </IconButton>
                    }
                  >
                    <ListItemIcon sx={{ minWidth: '30px' }}>
                      <ScheduleIcon />
                    </ListItemIcon>
                    <ListItemText primary={`${query}`} />
                  </ListItem>
                ))}

                {searchValue && (
                  <ListItem
                    sx={{
                      cursor: 'pointer',
                      ':hover': { backgroundColor: 'rgba(68, 73, 80, 0.15)' },
                      borderRadius: 1,
                    }}
                    onClick={handleSearchForClick}
                  >
                    <ListItemIcon sx={{ color: '#5569ff', minWidth: '30px' }}>
                      <SearchIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={`Search for "${searchValue}"`}
                      sx={{ color: '#5569ff' }}
                      primaryTypographyProps={{ fontSize: 16 }}
                    />
                  </ListItem>
                )}
              </List>
            </Paper>
          </Popper>
        </Box>
      </ClickAwayListener>
    </Box>
  );
}
export default SearchPopper;
