import React, { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import axios from 'axios';

const CreateDns = ({ open, onClose, id }) => {
  const [ip, setIp] = useState('');
  const [domain, setDomain] = useState('');
  const [domainError, setDomainError] = useState({ state: false, message: "" });
  const [businessType, setBusinessType] = useState('');

  const resetFields = () => {
    setIp('');
    setDomain('');
    setDomainError({ state: false, message: "" });
    setBusinessType('');
  };

  const handleSave = () => {
    if (!validateDomain(domain)) {
      setDomainError({ state: true, message: 'example: www.ali.com' });
      return;
    }

    const createdData = {
      ip: ip,
      domain: domain,
      business_type: businessType
    };

    axios.post("http://localhost:8082/dns", createdData)
      .then(response => {
        resetFields();
        onClose();
      })
      .catch(error => {
        if (error.response.status === 409) {
          setDomainError({ state: true, message: "domain already taken" })
        }
      });
  };

  const handleClose = () => {
    resetFields();
    onClose();
  };

  const validateDomain = (domain) => {
    const domainRegex = /^www\.[A-Za-z0-9]+\.[A-Za-z0-9]+$/;
    return domainRegex.test(domain)
  };

  const handleDomainInput = (event) => {
    const { value } = event.target;
    setDomain(value);
    setDomainError({ state: !validateDomain(value), message: "example: www.ali.com" });
  };

  const handleBusinessTypeChange = (event) => {
    setBusinessType(event.target.value);
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
          error={domainError.state}
          helperText={domainError.state ? domainError.message : ''}
          margin="dense"
          label="Domain"
          type="text"
          value={domain}
          onInput={handleDomainInput}
          fullWidth
          inputProps={{
            pattern: "^www\\.[A-Za-z0-9]+\\.[A-Za-z0-9]+$"
          }}
        />
        <Select
          value={businessType}
          onChange={handleBusinessTypeChange}
          displayEmpty
          fullWidth
          margin="dense"
          label="Business Type"
        >
          <MenuItem value="" disabled>
            Select Business Type
          </MenuItem>
          <MenuItem value="news">News</MenuItem>
          <MenuItem value="ecommerce">E-commerce</MenuItem>
          <MenuItem value="education">Education</MenuItem>
          <MenuItem value="government">Government</MenuItem>
          <MenuItem value="social">Social</MenuItem>
          <MenuItem value="others">Others</MenuItem>
        </Select>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateDns;
