import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  Container, 
  Grid, 
  Paper, 
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
  styled
} from '@mui/material';
import {
  ArrowBack,
  PictureAsPdf,
  Download,
  Share,
  MoreVert
} from '@mui/icons-material';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const CostingSheetContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(4),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(1),
  boxShadow: theme.shadows[1],
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(4),
}));

const SectionHeader = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  marginBottom: theme.spacing(2),
  paddingBottom: theme.spacing(1),
  borderBottom: `2px solid ${theme.palette.divider}`,
  color: theme.palette.primary.main
}));

const CostTable = styled(Table)(({ theme }) => ({
  '& .MuiTableCell-root': {
    padding: theme.spacing(1),
    borderBottom: `1px solid ${theme.palette.divider}`
  },
  '& .MuiTableCell-head': {
    fontWeight: 'bold',
    backgroundColor: theme.palette.grey[100]
  }
}));

const TotalRow = styled(TableRow)(({ theme }) => ({
  '& .MuiTableCell-root': {
    fontWeight: 'bold',
    backgroundColor: theme.palette.grey[100]
  }
}));

const FinalTotalRow = styled(TableRow)(({ theme }) => ({
  '& .MuiTableCell-root': {
    fontWeight: 'bold',
    fontSize: '1.1rem',
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.contrastText
  }
}));

function DesignDetail() {
  const { designId } = useParams();
  const navigate = useNavigate();
  const [design, setDesign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const open = Boolean(anchorEl);

  const fetchDesign = async () => {
    try {
      if (!parseInt(designId) || isNaN(designId)) {
        throw new Error('Invalid design number');
      }

      setLoading(true);
      const response = await fetch(`http://localhost:3000/api/designdetails/${designId}`);
      if (!response.ok) throw new Error('Design not found');
      const data = await response.json();
      setDesign(data.length > 0 ? data[0] : null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDesign();
  }, [designId]);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleExportPDF = () => {
    handleMenuClose();
    
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(20);
    doc.setTextColor(40);
    doc.text(`${design.designname} - Fabric Costing Sheet`, 105, 15, null, null, 'center');
    
    // Basic Specifications
    doc.setFontSize(14);
    doc.text('Basic Specifications', 14, 25);
    doc.autoTable({
      startY: 30,
      head: [['Specification', 'Value']],
      body: [
        ['Design Name', design.designname],
        ['Width', `${design.width} cm`],
        ['Reed', design.reed],
        ['Pick', design.pick],
        ['Warp Count', design.warpcount],
        ['Weft Count', design.weftcount]
      ],
      theme: 'grid',
      headStyles: {
        fillColor: [25, 118, 210],
        textColor: 255
      }
    });
    
    // Cost Breakdown
    doc.text('Cost Breakdown', 14, doc.autoTable.previous.finalY + 15);
    doc.autoTable({
      startY: doc.autoTable.previous.finalY + 20,
      head: [['Cost Type', 'Amount (₹)']],
      body: [
        ['Warp Cost', formatCurrency(design.warpcost)],
        ['Weft Cost', formatCurrency(design.weftcost)],
        ['Weaving Cost', formatCurrency(design.weavingcost)],
        ['Washing Cost', formatCurrency(design.washingcost)],
        ['Transport Cost', formatCurrency(design.transportcost)],
        ['Mending Cost', formatCurrency(design.mendingcost || 0)],
        ['Twisting Cost', formatCurrency(design.twistingcost || 0)]
      ],
      theme: 'grid',
      headStyles: {
        fillColor: [25, 118, 210],
        textColor: 255
      }
    });
    
    // Dyeing Costs
    doc.text('Dyeing Costs', 14, doc.autoTable.previous.finalY + 15);
    doc.autoTable({
      startY: doc.autoTable.previous.finalY + 20,
      head: [['Cost Type', 'Amount (₹)']],
      body: [
        ['Warp Dyeing', formatCurrency(design.warpdyeing)],
        ['Weft Dyeing', formatCurrency(design.weftdyeing)],
        ['Initial Warp Cost', formatCurrency(design.initwarpcost)],
        ['Initial Weft Cost', formatCurrency(design.initweftcost)]
      ],
      theme: 'grid',
      headStyles: {
        fillColor: [25, 118, 210],
        textColor: 255
      }
    });
    
    // Financial Summary
    doc.text('Financial Summary', 14, doc.autoTable.previous.finalY + 15);
    doc.autoTable({
      startY: doc.autoTable.previous.finalY + 20,
      head: [['Item', 'Amount (₹)']],
      body: [
        ['Profit Percentage', `${formatCurrency(design.profitpercent * 100)}%`],
        ['Profit Amount', formatCurrency(design.profit)],
        ['Total Cost', formatCurrency(design.totalcost)],
        ['GST', formatCurrency(design.gst)],
        ['Final Total', { content: formatCurrency(design.finaltotal), styles: { fontStyle: 'bold', fillColor: [46, 125, 50], textColor: 255 } }]
      ],
      theme: 'grid',
      headStyles: {
        fillColor: [25, 118, 210],
        textColor: 255
      }
    });
    
    doc.save(`${design.designname || 'design'}-costing-sheet.pdf`);
  };

  const formatCurrency = (value) => {
    return parseFloat(value).toFixed(2);
  };

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h4" color="error" gutterBottom>
          Error Loading Design
        </Typography>
        <Typography variant="body1" >
          {error}
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<ArrowBack />}
          onClick={() => navigate('/reports')}
          sx={{ mt: 2 }}
        >
          Back to Reports
        </Button>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>Loading Costing Sheet...</Typography>
      </Container>
    );
  }

  if (!design) {
    return null;
  }

  return (
    <Box sx={{ backgroundColor: theme.palette.grey[50], minHeight: '100vh', py: 4 }}>
      <CostingSheetContainer maxWidth="lg">
        {/* Header with actions */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Button 
            variant="outlined" 
            startIcon={<ArrowBack />}
            onClick={() => navigate('/reports')}
          >
            {isMobile ? 'Back' : 'Back to Reports'}
          </Button>
          
          <Box>
            <IconButton
              aria-label="more"
              aria-controls="export-menu"
              aria-haspopup="true"
              onClick={handleMenuClick}
              color="primary"
            >
              <MoreVert />
            </IconButton>
            <Menu
              id="export-menu"
              anchorEl={anchorEl}
              keepMounted
              open={open}
              onClose={handleMenuClose}
              PaperProps={{
                style: {
                  width: 200,
                },
              }}
            >
              <MenuItem onClick={handleExportPDF}>
                <PictureAsPdf color="error" sx={{ mr: 1 }} />
                Export as PDF
              </MenuItem>
              <MenuItem onClick={handleMenuClose}>
                <Share color="primary" sx={{ mr: 1 }} />
                Share Costing
              </MenuItem>
            </Menu>
          </Box>
        </Box>

        {/* Design Title */}
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: theme.palette.primary.dark }}>
          {design.designname} - Costing Sheet
        </Typography>

        {/* Basic Specifications */}
        <Box sx={{ mb: 4 }}>
          <SectionHeader variant="h5">Basic Specifications</SectionHeader>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={6} sm={4} md={3}>
              <Typography variant="subtitle2">Width</Typography>
              <Typography variant="body1">{design.width} cm</Typography>
            </Grid>
            <Grid item xs={6} sm={4} md={3}>
              <Typography variant="subtitle2">Reed</Typography>
              <Typography variant="body1">{design.reed}</Typography>
            </Grid>
            <Grid item xs={6} sm={4} md={3}>
              <Typography variant="subtitle2">Pick</Typography>
              <Typography variant="body1">{design.pick}</Typography>
            </Grid>
            <Grid item xs={6} sm={4} md={3}>
              <Typography variant="subtitle2">Warp Count</Typography>
              <Typography variant="body1">{design.warpcount}</Typography>
            </Grid>
            <Grid item xs={6} sm={4} md={3}>
              <Typography variant="subtitle2">Weft Count</Typography>
              <Typography variant="body1">{design.weftcount}</Typography>
            </Grid>
          </Grid>
        </Box>

        {/* Cost Breakdown */}
        <Box sx={{ mb: 4 }}>
          <SectionHeader variant="h5">Cost Breakdown</SectionHeader>
          <TableContainer component={Paper} elevation={0} sx={{ border: `1px solid ${theme.palette.divider}` }}>
            <CostTable size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Cost Type</TableCell>
                  <TableCell align="right">Amount (₹)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Warp Cost</TableCell>
                  <TableCell align="right">{formatCurrency(design.warpcost)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Weft Cost</TableCell>
                  <TableCell align="right">{formatCurrency(design.weftcost)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Weaving Cost</TableCell>
                  <TableCell align="right">{formatCurrency(design.weavingcost)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Washing Cost</TableCell>
                  <TableCell align="right">{formatCurrency(design.washingcost)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Transport Cost</TableCell>
                  <TableCell align="right">{formatCurrency(design.transportcost)}</TableCell>
                </TableRow>
                {design.mendingcost > 0 && (
                  <TableRow>
                    <TableCell>Mending Cost</TableCell>
                    <TableCell align="right">{formatCurrency(design.mendingcost)}</TableCell>
                  </TableRow>
                )}
                {design.twistingcost > 0 && (
                  <TableRow>
                    <TableCell>Twisting Cost</TableCell>
                    <TableCell align="right">{formatCurrency(design.twistingcost)}</TableCell>
                  </TableRow>
                )}
                <TotalRow>
                  <TableCell>Subtotal</TableCell>
                  <TableCell align="right">{formatCurrency(design.totalcost - design.profit - design.gst)}</TableCell>
                </TotalRow>
              </TableBody>
            </CostTable>
          </TableContainer>
        </Box>

        {/* Dyeing Costs */}
        <Box sx={{ mb: 4 }}>
          <SectionHeader variant="h5">Dyeing Costs</SectionHeader>
          <TableContainer component={Paper} elevation={0} sx={{ border: `1px solid ${theme.palette.divider}` }}>
            <CostTable size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Cost Type</TableCell>
                  <TableCell align="right">Amount (₹)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Warp Dyeing</TableCell>
                  <TableCell align="right">{formatCurrency(design.warpdyeing)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Weft Dyeing</TableCell>
                  <TableCell align="right">{formatCurrency(design.weftdyeing)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Initial Warp Cost</TableCell>
                  <TableCell align="right">{formatCurrency(design.initwarpcost)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Initial Weft Cost</TableCell>
                  <TableCell align="right">{formatCurrency(design.initweftcost)}</TableCell>
                </TableRow>
              </TableBody>
            </CostTable>
          </TableContainer>
        </Box>

        {/* Financial Summary */}
        <Box sx={{ mb: 4 }}>
          <SectionHeader variant="h5">Financial Summary</SectionHeader>
          <TableContainer component={Paper} elevation={0} sx={{ border: `1px solid ${theme.palette.divider}` }}>
            <CostTable size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Item</TableCell>
                  <TableCell align="right">Amount (₹)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Total Cost</TableCell>
                  <TableCell align="right">{formatCurrency(design.totalcost)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Profit ({formatCurrency(design.profitpercent * 100)}%)</TableCell>
                  <TableCell align="right">{formatCurrency(design.profit)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>GST</TableCell>
                  <TableCell align="right">{formatCurrency(design.gst)}</TableCell>
                </TableRow>
                <FinalTotalRow>
                  <TableCell>Final Total</TableCell>
                  <TableCell align="right">{formatCurrency(design.finaltotal)}</TableCell>
                </FinalTotalRow>
              </TableBody>
            </CostTable>
          </TableContainer>
        </Box>

        {/* Notes or Additional Information */}
        <Box sx={{ mt: 4, p: 2, backgroundColor: theme.palette.grey[100], borderRadius: 1 }}>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
            Notes:
          </Typography>
          <Typography variant="body2">
            This costing sheet includes all production costs, dyeing charges, and applicable taxes.
            Final price is inclusive of {formatCurrency(design.profitpercent * 100)}% profit margin.
          </Typography>
        </Box>
      </CostingSheetContainer>
    </Box>
  );
}

export default DesignDetail;