import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
import TextField from '@mui/material/TextField';
import Dns from "./Dns";
import EditDns from "./EditDns";
import DeleteDns from "./DeleteDns";
import CreateDns from "./CreateDns";
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import BusinessStat from "./BusinessStat";
import CountryStat from "./CountryStat";
import OwnerStat from "./OwnerStat";
import DomainStat from "./DomainStat";
import AccessStat from "./AccessStat";

function DnsList() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalRows, setTotalRows] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [editModalStatus, setEditModalStatus] = useState({state: false, id: null});
  const [deleteModalStatus, setDeleteModalStatus] = useState({state: false, id: null});
  const [createModalStatus, setCreateModalStatus] = useState(false);
  const [countryStat, setCountryStat] = useState([]);
  const [businessStat, setBusinessStat] = useState([]);
  const [ownerStat, setOwnerStat] = useState([]);
  const [domainStat, setDomainStat] = useState([]);
  const [accessStat, setAccessStat] = useState([]);

  const fetchCountryStat = () => {
    axios.get(`http://localhost:8082/stat/country`)
      .then(response => {
        setCountryStat(response.data);
      })
      .catch(error => {
        console.error('Error fetching countries:', error);
      });
  };
  const fetchAccessStat = () => {
    axios.get(`http://localhost:8082/stat/access`)
      .then(response => {
        setAccessStat(response.data);
      })
      .catch(error => {
        console.error('Error fetching countries:', error);
      });
  };
  const fetchOwnerStat = () => {
    axios.get(`http://localhost:8082/stat/owner`)
      .then(response => {
        setOwnerStat(response.data);
      })
      .catch(error => {
        console.error('Error fetching countries:', error);
      });
  };
    const fetchDomainStat = () => {
    axios.get(`http://localhost:8082/stat/domain`)
      .then(response => {
        setDomainStat(response.data);
      })
      .catch(error => {
        console.error('Error fetching countries:', error);
      });
  };
  const fetchBusinessStat = () => {
    axios.get(`http://localhost:8082/stat/business`)
      .then(response => {
        setBusinessStat(response.data);
      })
      .catch(error => {
        console.error('Error fetching countries:', error);
      });
  };

  useEffect(() => {
    fetchData();
    fetchBusinessStat();
    fetchOwnerStat();
    fetchCountryStat();
    fetchDomainStat();
    fetchAccessStat();
  }, [page, rowsPerPage, searchQuery, editModalStatus, deleteModalStatus, createModalStatus]);

  const fetchData = () => {
    const params = {
      page: page, // Adjusted page number (1-indexed instead of 0-indexed)
      size: rowsPerPage,
      search: searchQuery
    };

    axios.get("http://localhost:8082/dns", { params })
      .then(response => {
        setData(response.data.dnses.map(item => ({ ...item, id: item._id })));
        setTotalRows(response.data.total_count);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to the first page when changing rows per page
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(0); // Reset to the first page when performing a search
  };

  const onDelete = (id) => {
    console.log(`Delete row with id ${id}`);
    setDeleteModalStatus({state: true, id: id}); // Open the edit modal
  };

  const onEdit = (id) => {
    console.log(`Edit row with id ${id}`);
    setEditModalStatus({state: true, id: id}); // Open the edit modal
  };

  const onCreate = () => {
    setCreateModalStatus(true)
  }

  const handleCloseEditModal = () => {
    setEditModalStatus({state: false, id: null});
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalStatus({state: false, id: null});
  };

  const handleCloseCreateModal = () => {
    setCreateModalStatus(false);
  };

  return (
    <div>
      <TextField
        label="Search"
        variant="outlined"
        value={searchQuery}
        onChange={handleSearchChange}
        style={{ margin: '1rem' }}
      />
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={onCreate}
        style={{ margin: '1.5rem' }}
      >
        Create
      </Button>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">ip</TableCell>
              <TableCell align="center">domain</TableCell>
              <TableCell align="center">business type</TableCell>
              <TableCell align="center">country</TableCell>
              <TableCell align="center">owner</TableCell>
              <TableCell align="center">operations</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <Dns
              key={row.id}
              row={row}
              onDelete={onDelete}
              onEdit={onEdit}
            />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={totalRows}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <EditDns open={editModalStatus.state} onClose={handleCloseEditModal} id={editModalStatus.id} />
      <DeleteDns open={deleteModalStatus.state} onClose={handleCloseDeleteModal} id={deleteModalStatus.id} />
      <CreateDns open={createModalStatus} onClose={handleCloseCreateModal}/>
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <BusinessStat stats={businessStat} />
        <CountryStat stats={countryStat}/>
      </div>
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <OwnerStat stats={ownerStat} />
          <DomainStat stats={domainStat} />
        </div>
      <AccessStat stats={accessStat}/>

    </div>
  );
}

export default DnsList;
