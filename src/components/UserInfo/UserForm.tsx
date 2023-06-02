import { zodResolver } from '@hookform/resolvers/zod';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import type { MRT_ColumnDef } from 'material-react-table';
import { MRT_Row } from 'material-react-table';
import { useContext, useEffect, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
// import Select from 'react-select';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { User, UserRole } from '@types';
import { userApis } from 'apis';
import { useModalContext } from 'contexts';
import { QueryKeys, useUpdateUserMutation } from 'queries';

const phoneRegExp = /^\+?\d{9,15}$/;
const UserSchema = z.object({
  name: z.string().min(1),
  // personalMail: z.string().email(),
  phoneNumber: z.string().regex(phoneRegExp, { message: 'Invalid phone number' }),
});

// https://github.com/react-hook-form/react-hook-form/issues/9287
// type UserFormInputs2 = z.infer<typeof GroupSchema>; //will not work
export type UserFormInputs = z.infer<typeof UserSchema>;
type UserFormBody = UserFormInputs & { id: number };
interface UserFormProps {
  defaultValues?: UserFormBody;
}
function UserForm({ defaultValues }: UserFormProps) {
  const { dispatch } = useModalContext();
  const queryClient = useQueryClient();

  const updateUserMutation = useUpdateUserMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserFormInputs>({
    mode: 'all',
    resolver: zodResolver(UserSchema),
    defaultValues: {
      ...defaultValues,
    },
  });

  function onSubmit(data: UserFormInputs) {
    const body: UserFormBody = {
      ...defaultValues,
      ...data,
    } as UserFormBody;
    updateUserMutation.mutate({ body });
  }

  return (
    <>
      <Box
        onSubmit={handleSubmit(onSubmit)}
        component="form"
        id="entityForm"
        autoComplete="off"
        noValidate
        sx={{
          '& .MuiTextField-root': { m: 1, width: '100%' },
          height: 150,
        }}
      >
        <TextField
          label="Name"
          required
          error={Boolean(errors.name)}
          helperText={errors.name?.message}
          {...register('name')}
        />
        {/* <TextField
          label="Personal E-mail"
          required
          error={Boolean(errors.personalMail)}
          helperText={errors.personalMail?.message}
          {...register('personalMail')}
        /> */}
        <TextField
          label="Phone Number"
          // required
          error={Boolean(errors.phoneNumber)}
          helperText={errors.phoneNumber?.message}
          {...register('phoneNumber')}
        />
      </Box>
    </>
  );
}
export default UserForm;
