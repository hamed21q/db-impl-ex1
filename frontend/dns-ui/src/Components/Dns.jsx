import React from 'react';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const Dns = ({ row, onDelete, onEdit }) => {
  return (
    <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
      <TableCell align="center">{row.id}</TableCell>
      <TableCell align="center">{row.ip}</TableCell>
      <TableCell align="center">{row.domain}</TableCell>
      <TableCell align="center">
        <IconButton color="primary" onClick={() => onDelete(row.id)}>
          <DeleteIcon />
        </IconButton>
        <IconButton color="primary" onClick={() => onEdit(row.id)}>
          <EditIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

export default Dns;
