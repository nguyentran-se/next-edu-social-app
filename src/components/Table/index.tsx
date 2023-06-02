import DeleteOutlined from '@mui/icons-material/DeleteOutlined';
import EditOutlined from '@mui/icons-material/EditOutlined';
import GroupAddOutlined from '@mui/icons-material/GroupAddOutlined';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import type { MRT_ColumnDef } from 'material-react-table';
import MaterialReactTable, { MRT_Row, MaterialReactTableProps } from 'material-react-table';
interface TableProps {
  columns: MRT_ColumnDef<any>[];
  onEditEntity?: (row: MRT_Row<any>) => void;
  onDeleteEntity?: (row: MRT_Row<any>) => void;
  onAddUserToEntity?: (row: MRT_Row<any>) => void;
  data: any[];
  state: MaterialReactTableProps['state'];
  getRowId: MaterialReactTableProps['getRowId'];
  initialState?: MaterialReactTableProps['initialState'];
}
function Table({
  columns,
  onEditEntity,
  onDeleteEntity,
  onAddUserToEntity,
  data,
  state,
  getRowId,
  initialState = { density: 'compact' },
}: TableProps) {
  const tableProps: Partial<MaterialReactTableProps> = {};
  const applyRowActions = Boolean(onEditEntity) || Boolean(onDeleteEntity);
  if (applyRowActions)
    tableProps.renderRowActions = ({ row }) => (
      <Box>
        {Boolean(onAddUserToEntity) && (
          <IconButton
            color="info"
            size="small"
            onClick={() => onAddUserToEntity && onAddUserToEntity(row as any)}
          >
            <GroupAddOutlined />
          </IconButton>
        )}
        {Boolean(onEditEntity) && (
          <IconButton size="small" onClick={() => onEditEntity && onEditEntity(row as any)}>
            <EditOutlined color="warning" />
          </IconButton>
        )}
        {Boolean(onDeleteEntity) && (
          <IconButton
            color="error"
            size="small"
            onClick={() => onDeleteEntity && onDeleteEntity(row as any)}
          >
            <DeleteOutlined />
          </IconButton>
        )}
      </Box>
    );
  return (
    <MaterialReactTable
      getRowId={getRowId}
      columns={columns as any}
      data={data ?? []}
      state={state}
      muiTablePaperProps={{
        elevation: 0,
        sx: {
          borderRadius: '10px',
          padding: 2,
          '& .MuiTableRow-root': {
            backgroundColor: '#fff',
          },
          '& .MuiToolbar-root': {
            backgroundColor: '#fff',
          },
          '& .MuiTableCell-root:last-child > .MuiBox-root': {
            display: 'flex',
            alignItems: 'center',
          },
          minHeight: 500,
        },
      }}
      muiTopToolbarProps={{
        sx: {
          '& .MuiCollapse-root .MuiFormControl-root': {
            minHeight: '30px',
          },
        },
      }}
      {...tableProps}
      displayColumnDefOptions={{
        'mrt-row-actions': {
          size: 40,
        },
      }}
      positionActionsColumn="last"
      enableRowActions={applyRowActions}
      enableFullScreenToggle={false}
      initialState={initialState}
    />
  );
}

export default Table;
