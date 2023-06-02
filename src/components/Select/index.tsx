import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import FormLabel from '@mui/material/FormLabel';
import { Controller } from 'react-hook-form';
import ReactSelect from 'react-select';
import { SelectProps } from '@types';
function Select({
  fieldName,
  options,
  error,
  required = true,
  isDisabled = false,
  onChange,
  value,
  placeholder,
}: SelectProps) {
  const defaultConfig = {
    isSearchable: true,
    isClearable: true,
    className: 'react-select-container',
    classNamePrefix: 'react-select',
  };
  const errorSelectStyle = error
    ? {
        borderColor: 'red',
        color: 'red',
      }
    : {};
  return (
    <FormControl sx={{ width: '100%', m: '10px 0', position: 'relative' }}>
      <FormLabel
        sx={{
          position: 'absolute',
          top: -8,
          left: 10,
          zIndex: 2,
          fontSize: '10px',
          background: '#fff',
          paddingLeft: '2px',
          paddingRight: '4px',
          boxSizing: 'border-box',
          color: error ? 'red' : 'inherit',
          backgroundColor: isDisabled ? 'hsl(0, 0%, 95%)' : '#fff',
          userSelect: 'none',
        }}
        required={required}
      >
        {fieldName}
      </FormLabel>
      <ReactSelect
        required={required}
        placeholder={placeholder}
        // defaultValue={options.find((o) => o.value === value)}
        maxMenuHeight={130}
        isDisabled={isDisabled}
        // @ts-ignore - Conflict btw react-hook-form and react-select
        options={options}
        getOptionValue={(option: any) => option.value}
        getOptionLabel={(option: any) => option.label}
        onChange={onChange}
        value={value}
        isOptionSelected={() => false}
        styles={{
          control: (baseStyles) => ({
            ...baseStyles,
            ...errorSelectStyle,
          }),
          placeholder: (baseStyles) => ({
            ...baseStyles,
            ...errorSelectStyle,
          }),
        }}
        {...defaultConfig}
      />
      <FormHelperText sx={{ m: '3px 14px 0' }} error={error}>
        {error && (
          <>
            <span style={{ textTransform: 'capitalize' }}>{fieldName}</span>
            <span>is required</span>
          </>
        )}
      </FormHelperText>
    </FormControl>
  );
}

export default Select;
