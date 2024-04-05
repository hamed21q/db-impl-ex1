import React, {useEffect, useState} from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import axios from 'axios';

const CreateDns = ({ open, onClose, id }) => {
  const [ip, setIp] = useState('');
  const [domain, setDomain] = useState('');

  const resetFields = () => {
    setIp('');
    setDomain('');
  };

  const handleClose = () => {
    resetFields();
    onClose();
  };
  const handleSave = () => {
    const createdData = {
      ip: ip,
      domain: domain
    };

    // Send a PUT request to update the data
    axios.post(`http://localhost:8082/dns`, createdData)
      .then(response => {
        console.log('Data updated successfully:', response.data);
        onClose(); // Close the modal after saving
      })
      .catch(error => {
        console.error('Error updating data:', error);
      });
    handleClose(); // Close the modal after saving
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Create Dns</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="IP"
          type="text"
          value={ip}
          onChange={(e) => setIp(e.target.value)}
          fullWidth
        />
        <TextField
          margin="dense"
          label="Domain"
          type="text"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          fullWidth
        />
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

export default CreateDns;
