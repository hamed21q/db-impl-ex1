import React, {useEffect, useState} from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import axios from 'axios';

const EditDns = ({ open, onClose, id }) => {
  const [ip, setIp] = useState('');
  const [domain, setDomain] = useState('');

  useEffect(() => {
    if (open) {
      axios.get(`http://localhost:8082/dns/${id}`)
        .then(response => {
          // Set the initial values in the state
          setIp(response.data.ip);
          setDomain(response.data.domain);
        })
        .catch(error => {
          console.error('Error fetching current values:', error);
        });
    }
  }, [open, id]);

  const handleSave = () => {
    const updatedData = {
      ip: ip,
      domain: domain
    };

    // Send a PUT request to update the data
    axios.put(`/api/dns/${id}`, updatedData)
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
      <DialogTitle>Edit Row</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="ID"
          type="text"
          value={id}
          onChange={(e) => setIp(e.target.value)}
          fullWidth
          InputProps={{
              readOnly: true,
              sx: { color: 'rgba(0, 0, 0, 0.54)' }
          }}
        />
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

export default EditDns;
