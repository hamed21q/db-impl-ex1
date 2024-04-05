import React, {useEffect, useState} from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import axios from 'axios';

const DeleteDns = ({ open, onClose, id }) => {
  const [ip, setIp] = useState('');
  const [domain, setDomain] = useState('');


  const handleSave = () => {

    // Send a PUT request to update the data
    axios.delete(`/api/dns/${id}`)
      .then(response => {
        console.log('Data updated successfully:', response.data);
        onClose(); // Close the modal after saving
      })
      .catch(error => {
        console.error('Error updating data:', error);
      });
    onClose(); // Close the modal after saving
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Delete Row</DialogTitle>
      <DialogContent>
        <p>Do you want to delete this record?</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteDns;

