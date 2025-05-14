import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  Container, 
  Grid, 
  Paper, 
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
  styled,
  Chip
} from '@mui/material';
import {
  ArrowBack,
  PictureAsPdf,
  MoreVert,
  InfoOutlined,
  AttachMoney,
  LocalShipping,
  Palette,
  Receipt
} from '@mui/icons-material';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

// Modern styled components
const CostingSheetContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(4),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[2],
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
  position: 'relative',
  border: `1px solid ${theme.palette.divider}`,
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2)
  }
}));

const SectionHeader = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  marginBottom: theme.spacing(2),
  color: theme.palette.text.primary,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  fontSize: '1.1rem',
  '& svg': {
    color: theme.palette.primary.main
  }
}));

const CostTable = styled(Table)(({ theme }) => ({
  '& .MuiTableCell-root': {
    padding: theme.spacing(1.5),
    borderBottom: `1px solid ${theme.palette.divider}`,
    fontSize: '0.875rem'
  },
  '& .MuiTableCell-head': {
    fontWeight: 600,
    backgroundColor: theme.palette.grey[100],
    color: theme.palette.text.primary,
    fontSize: '0.8rem'
  }
}));

const TotalRow = styled(TableRow)(({ theme }) => ({
  '& .MuiTableCell-root': {
    fontWeight: 600,
    backgroundColor: theme.palette.grey[50]
  }
}));

const FinalTotalRow = styled(TableRow)(({ theme }) => ({
  '& .MuiTableCell-root': {
    fontWeight: 700,
    fontSize: '0.95rem',
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.contrastText
  }
}));

const SpecCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.spacing(1),
  boxShadow: 'none',
  border: `1px solid ${theme.palette.divider}`,
  height: '100%',
  transition: 'all 0.2s ease',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    boxShadow: theme.shadows[2]
  }
}));

const DesignTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.text.primary,
  marginBottom: theme.spacing(1),
  [theme.breakpoints.down('sm')]: {
    fontSize: '1.5rem'
  }
}));

const DesignSubtitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(3)
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };

  const open = Boolean(anchorEl);

  const fetchDesign = async () => {
    try {
      if (!parseInt(designId) || isNaN(designId)) {
        throw new Error('Invalid design number');
      }

      setLoading(true);
      const response = await fetch(`https://texel.onrender.com/api/designdetails/${designId}`);
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
    doc.setFontSize(18);
    doc.setTextColor(40);
    doc.text(`${design.designname} - Fabric Costing Sheet`, 105, 15, null, null, 'center');
    
    // Basic Specifications
    doc.setFontSize(12);
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
        ['Weft Count', design.weftcount],
        ['Warp Weight', design.warpweight]
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
    return parseFloat(value).toLocaleString('en-IN', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2
    });
  };

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="error" gutterBottom>
          Error Loading Design
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          {error}
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<ArrowBack />}
          onClick={() => navigate('/reports')}
          sx={{ 
            borderRadius: '8px',
            textTransform: 'none'
          }}
        >
          Back to Reports
        </Button>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h6" gutterBottom>Loading Costing Sheet...</Typography>
      </Container>
    );
  }

  if (!design) {
    return null;
  }

  return (
    <Box sx={{ 
      backgroundColor: theme.palette.grey[50], 
      minHeight: '100vh', 
      py: 4
    }}>
      <CostingSheetContainer maxWidth="lg">
        {/* Header with actions */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 4,
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? 2 : 0
        }}>
          <Button 
            variant="outlined" 
            startIcon={<ArrowBack />}
            onClick={() => navigate('/reports')}
            sx={{
              borderRadius: '8px',
              textTransform: 'none',
              alignSelf: isMobile ? 'stretch' : 'flex-start'
            }}
          >
            Back to Reports
          </Button>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="contained"
              startIcon={<PictureAsPdf />}
              onClick={handleExportPDF}
              sx={{
                borderRadius: '8px',
                textTransform: 'none',
                boxShadow: 'none'
              }}
            >
              {isMobile ? 'PDF' : 'Export PDF'}
            </Button>
            <IconButton
              aria-label="more"
              aria-controls="export-menu"
              aria-haspopup="true"
              onClick={handleMenuClick}
              sx={{
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: '8px'
              }}
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
                  borderRadius: '12px',
                  boxShadow: theme.shadows[3]
                },
              }}
            >
              <MenuItem onClick={handleExportPDF}>
                <PictureAsPdf color="error" sx={{ mr: 1 }} />
                Export PDF
              </MenuItem>
              <MenuItem onClick={handleMenuClose}>
                <Receipt color="primary" sx={{ mr: 1 }} />
                Print Report
              </MenuItem>
            </Menu>
          </Box>
        </Box>

        {/* Design Header */}
        <Box sx={{ mb: 4 }}>
          <Chip 
            label="Costing Sheet" 
            size="small" 
            color="primary" 
            variant="outlined"
            sx={{ mb: 1 }}
          />
          <DesignTitle variant="h4">
            {design.designname}
          </DesignTitle>
          <DesignSubtitle variant="body2">
            <span>Created on {formatDate(design.created_date)}</span>
            <span>•</span>
            <span>ID: {designId}</span>
          </DesignSubtitle>
        </Box>

        {/* Basic Specifications */}
        <Box sx={{ mb: 4 }}>
          <SectionHeader variant="h6">
            <InfoOutlined fontSize="small" />
            Fabric Specifications
          </SectionHeader>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={6} sm={4} md={3}>
              <SpecCard>
                <Typography variant="subtitle2" color="textSecondary">Width</Typography>
                <Typography variant="h6">{design.width} cm</Typography>
              </SpecCard>
            </Grid>
            <Grid item xs={6} sm={4} md={3}>
              <SpecCard>
                <Typography variant="subtitle2" color="textSecondary">Warp Count</Typography>
                <Typography variant="h6">{design.warpcount}</Typography>
              </SpecCard>
            </Grid>
            <Grid item xs={6} sm={4} md={3}>
              <SpecCard>
                <Typography variant="subtitle2" color="textSecondary">Reed</Typography>
                <Typography variant="h6">{design.reed}</Typography>
              </SpecCard>
            </Grid>
            <Grid item xs={6} sm={4} md={3}>
              <SpecCard>
                <Typography variant="subtitle2" color="textSecondary">Warp Weight</Typography>
                <Typography variant="h6">{design.warpweight}</Typography>
              </SpecCard>
            </Grid>
            <Grid item xs={6} sm={4} md={3}>
              <SpecCard>
                <Typography variant="subtitle2" color="textSecondary">Weft Count</Typography>
                <Typography variant="h6">{design.weftcount}</Typography>
              </SpecCard>
            </Grid>
            <Grid item xs={6} sm={4} md={3}>
              <SpecCard>
                <Typography variant="subtitle2" color="textSecondary">Pick</Typography>
                <Typography variant="h6">{design.pick}</Typography>
              </SpecCard>
            </Grid>
            <Grid item xs={6} sm={4} md={3}>
              <SpecCard>
                <Typography variant="subtitle2" color="textSecondary">Weft Weight</Typography>
                <Typography variant="h6">{design.weftweight}</Typography>
              </SpecCard>
            </Grid>
          </Grid>
        </Box>

        {/* Dyeing Costs */}
        <Box sx={{ mb: 4 }}>
          <SectionHeader variant="h6">
            <Palette fontSize="small" />
            Dyeing Costs
          </SectionHeader>
          <TableContainer 
            component={Paper} 
            variant="outlined"
            sx={{ borderRadius: '8px' }}
          >
            <CostTable>
              <TableHead>
                <TableRow>
                  <TableCell>Cost Type</TableCell>
                  <TableCell align="right">Amount (₹)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow hover>
                  <TableCell>Initial Warp Cost</TableCell>
                  <TableCell align="right">{formatCurrency(design.initwarpcost)}</TableCell>
                </TableRow>
                <TableRow hover>
                  <TableCell>Warp Dyeing</TableCell>
                  <TableCell align="right">{formatCurrency(design.warpdyeing)}</TableCell>
                </TableRow>
                <TableRow hover>
                  <TableCell>Initial Weft Cost</TableCell>
                  <TableCell align="right">{formatCurrency(design.initweftcost)}</TableCell>
                </TableRow>
                <TableRow hover>
                  <TableCell>Weft Dyeing</TableCell>
                  <TableCell align="right">{formatCurrency(design.weftdyeing)}</TableCell>
                </TableRow>
              </TableBody>
            </CostTable>
          </TableContainer>
        </Box>

        {/* Cost Breakdown */}
        <Box sx={{ mb: 4 }}>
          <SectionHeader variant="h6">
            <AttachMoney fontSize="small" />
            Cost Breakdown
          </SectionHeader>
          <TableContainer 
            component={Paper} 
            variant="outlined"
            sx={{ borderRadius: '8px' }}
          >
            <CostTable>
              <TableHead>
                <TableRow>
                  <TableCell>Cost Type</TableCell>
                  <TableCell align="right">Amount (₹)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow hover>
                  <TableCell>Warp Cost</TableCell>
                  <TableCell align="right">{formatCurrency(design.warpcost)}</TableCell>
                </TableRow>
                <TableRow hover>
                  <TableCell>Weft Cost</TableCell>
                  <TableCell align="right">{formatCurrency(design.weftcost)}</TableCell>
                </TableRow>
                <TableRow hover>
                  <TableCell>Weaving Cost</TableCell>
                  <TableCell align="right">{formatCurrency(design.weavingcost)}</TableCell>
                </TableRow>
                <TableRow hover>
                  <TableCell>Washing Cost</TableCell>
                  <TableCell align="right">{formatCurrency(design.washingcost)}</TableCell>
                </TableRow>
                <TableRow hover>
                  <TableCell>Transport Cost</TableCell>
                  <TableCell align="right">{formatCurrency(design.transportcost)}</TableCell>
                </TableRow>
                {design.mendingcost > 0 && (
                  <TableRow hover>
                    <TableCell>Mending Cost</TableCell>
                    <TableCell align="right">{formatCurrency(design.mendingcost)}</TableCell>
                  </TableRow>
                )}
                {design.twistingcost > 0 && (
                  <TableRow hover>
                    <TableCell>Twisting Cost</TableCell>
                    <TableCell align="right">{formatCurrency(design.twistingcost)}</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </CostTable>
          </TableContainer>
        </Box>

        {/* Financial Summary */}
        <Box sx={{ mb: 4 }}>
          <SectionHeader variant="h6">
            <Receipt fontSize="small" />
            Financial Summary
          </SectionHeader>
          <TableContainer 
            component={Paper} 
            variant="outlined"
            sx={{ borderRadius: '8px' }}
          >
            <CostTable>
              <TableHead>
                <TableRow>
                  <TableCell>Item</TableCell>
                  <TableCell align="right">Amount (₹)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow hover>
                  <TableCell>Total Cost</TableCell>
                  <TableCell align="right">{formatCurrency(design.totalcost)}</TableCell>
                </TableRow>
                <TableRow hover>
                  <TableCell>Profit ({formatCurrency(design.profitpercent * 100)}%)</TableCell>
                  <TableCell align="right">{formatCurrency(design.profit)}</TableCell>
                </TableRow>
                <TableRow hover>
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

        {/* Footer Note */}
        <Box sx={{ 
          mt: 4, 
          p: 2, 
          backgroundColor: theme.palette.grey[100], 
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <Typography variant="caption" color="textSecondary">
            © {new Date().getFullYear()} Texel. All rights reserved. 
            This is a proprietary application owned by Mithileshwaran.
          </Typography>
        </Box>
      </CostingSheetContainer>
    </Box>
  );
}

export default DesignDetail;