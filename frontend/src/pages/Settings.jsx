import { FaCog } from "react-icons/fa";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useState,useEffect } from "react";

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData('Frozen yoghurt', 159,300),
  createData('Ice cream sandwich', 270,300),
  createData('Eclair', 262,300),
  createData('Cupcake', 305,300),
  createData('Gingerbread', 356,300),
];



function Settings() {
  const [rows,setRows] = useState([]);
  const [headers, setHeaders] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:3000/api/yarnDetails`) // replace with actual path
      .then((res) => res.json())
      .then((data) => {
        setRows(data);
        if (data.length > 0) {
          setHeaders(Object.keys(data[0]));
        }
      })
      .catch((err) => console.error('Error fetching data:', err));
  }, []);



  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold flex items-center mb-6">
        <FaCog className="mr-2" />
        Settings
      </h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold flex items-center mb-6">YARN DETAILS</h1>
      <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
          {headers.map((header,index) => (
                  <TableCell key={header} align={index === 0 ? 'left' : 'right'}>{header}</TableCell>
                ))}
          </TableRow>
        </TableHead>
        <TableBody>
              {rows.map((row, i) => (
                <TableRow key={i}>
                  {headers.map((header) => (
                    <TableCell key={header} align={header === headers[0] ? 'left' : 'right'}>
                      {row[header]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
      </Table>
    </TableContainer>

      </div>
    </div>
  );
}

export default Settings;