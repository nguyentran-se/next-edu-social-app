import React from 'react';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';

const SearchInput = React.forwardRef<HTMLDivElement, TextFieldProps>(function SearchInput(
  { placeholder = 'Search Workspace', sx, ...props },
  forwardedRef,
) {
  return (
    <TextField
      ref={forwardedRef}
      sx={{
        width: '100%',
        '.MuiInputBase-root': { borderRadius: '24px', height: '36px' },
        minHeight: 'unset',
        ...sx,
      }}
      size="small"
      variant="outlined"
      placeholder={placeholder}
      // onChange={handleChange}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
        // endAdornment: (
        //   <IconButton sx={{ cursor: 'pointer' }} size="small">
        //     <CloseIcon fontSize="small" />
        //   </IconButton>
        // ),
        // endAdornment: (
        //   <InputAdornment
        //     position="end"
        //     style={{ display: showClearIcon }}
        //     onClick={handleClick}
        //   >
        //     <ClearIcon />
        //   </InputAdornment>
        // )
      }}
      {...props}
    />
  );
});

export default SearchInput;
