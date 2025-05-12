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
  MoreVert,
  InfoOutlined
} from '@mui/icons-material';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const CostingSheetContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(4),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(2),
  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)',
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    borderTopLeftRadius: theme.spacing(2),
    borderTopRightRadius: theme.spacing(2)
  }
}));

const SectionHeader = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  marginBottom: theme.spacing(3),
  paddingBottom: theme.spacing(1.5),
  borderBottom: `1px solid ${theme.palette.divider}`,
  color: theme.palette.text.primary,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  '&::after': {
    content: '""',
    flex: 1,
    marginLeft: theme.spacing(2),
    height: 1,
    backgroundColor: theme.palette.divider
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
    backgroundColor: theme.palette.grey[50],
    color: theme.palette.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    fontSize: '0.75rem'
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
    fontSize: '1rem',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText
  }
}));

const SpecCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.spacing(1),
  boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)',
  transition: 'all 0.2s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    borderLeft: `3px solid ${theme.palette.primary.main}`
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

   const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString(undefined, options); // e.g., "12 May 2025"
};

  const DateText = styled(Typography)(({ theme }) => ({
  fontSize: '0.85rem',
  color: theme.palette.text.secondary,
  whiteSpace: 'nowrap',
}));

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
          sx={{ 
            mt: 2,
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            color: 'white'
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
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 500 }}>Loading Costing Sheet...</Typography>
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
      py: 4,
      backgroundImage: 'linear-gradient(to bottom, rgba(255,255,255,0.9), rgba(255,255,255,0.9))'
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
              borderRadius: 2,
              borderWidth: 2,
              '&:hover': {
                borderWidth: 2
              }
            }}
          >
            {isMobile ? 'Back' : 'Back to Reports'}
          </Button>
          
          <Box>
            <Button
              variant="contained"
              startIcon={<PictureAsPdf />}
              onClick={handleExportPDF}
              sx={{
                mr: 1,
                background: `linear-gradient(135deg, ${theme.palette.error.main}, ${theme.palette.error.dark})`,
                color: 'white',
                borderRadius: 2
              }}
            >
              Export PDF
            </Button>
            <IconButton
              aria-label="more"
              aria-controls="export-menu"
              aria-haspopup="true"
              onClick={handleMenuClick}
              sx={{
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: theme.palette.grey[100]
                }
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
                  borderRadius: 12,
                  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)'
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
        <Typography variant="h3" gutterBottom sx={{ 
          fontWeight: 700, 
          color: theme.palette.text.primary,
          mb: 4,
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: -8,
            left: 0,
            width: 60,
            height: 4,
            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            borderRadius: 2
          }
        }}>
          {design.designname} - Costing Sheet
        </Typography>
        <DateText variant="caption">{formatDate(design.created_date)}</DateText>
        

        {/* Basic Specifications */}
        <Box sx={{ mb: 4 }}>
          <SectionHeader variant="h5">
            <InfoOutlined color="primary" />
            Basic Specifications
          </SectionHeader>
          <Grid container spacing={3} sx={{ mb: 2 }}>
            <Grid item xs={6} sm={4} md={3}>
              <SpecCard elevation={0}>
                <Typography variant="subtitle2" color="textSecondary">Width</Typography>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>{design.width} cm</Typography>
              </SpecCard>
            </Grid>
            <Grid item xs={6} sm={4} md={3}>
              <SpecCard elevation={0}>
                <Typography variant="subtitle2" color="textSecondary">Warp Count</Typography>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>{design.warpcount}</Typography>
              </SpecCard>
            </Grid>
            <Grid item xs={6} sm={4} md={3}>
              <SpecCard elevation={0}>
                <Typography variant="subtitle2" color="textSecondary">Reed</Typography>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>{design.reed}</Typography>
              </SpecCard>
            </Grid>
            <Grid item xs={6} sm={4} md={3}>
              <SpecCard elevation={0}>
                <Typography variant="subtitle2" color="textSecondary">Warp Weight</Typography>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>{design.warpweight}</Typography>
              </SpecCard>
            </Grid>
            <Grid item xs={6} sm={4} md={3}>
              <SpecCard elevation={0}>
                <Typography variant="subtitle2" color="textSecondary">Weft Count</Typography>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>{design.weftcount}</Typography>
              </SpecCard>
            </Grid>
            <Grid item xs={6} sm={4} md={3}>
              <SpecCard elevation={0}>
                <Typography variant="subtitle2" color="textSecondary">Pick</Typography>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>{design.pick}</Typography>
              </SpecCard>
            </Grid>
            <Grid item xs={6} sm={4} md={3}>
              <SpecCard elevation={0}>
                <Typography variant="subtitle2" color="textSecondary">Weft Weight</Typography>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>{design.weftweight}</Typography>
              </SpecCard>
            </Grid>
            
          </Grid>
        </Box>

        {/* Dyeing Costs */}
        <Box sx={{ mb: 4 }}>
          <SectionHeader variant="h5">
            <InfoOutlined color="primary" />
            Dyeing Costs
          </SectionHeader>
          <TableContainer 
            component={Paper} 
            elevation={0} 
            sx={{ 
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`,
              overflow: 'hidden'
            }}
          >
            <CostTable size="small">
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
          <SectionHeader variant="h5">
            <InfoOutlined color="primary" />
            Cost Breakdown
          </SectionHeader>
          <TableContainer 
            component={Paper} 
            elevation={0} 
            sx={{ 
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`,
              overflow: 'hidden'
            }}
          >
            <CostTable size="small">
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
          <SectionHeader variant="h5">
            <InfoOutlined color="primary" />
            Financial Summary
          </SectionHeader>
          <TableContainer 
            component={Paper} 
            elevation={0} 
            sx={{ 
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`,
              overflow: 'hidden'
            }}
          >
            <CostTable size="small">
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

        {/* Notes or Additional Information */}
        <Box sx={{ 
          mt: 4, 
          p: 3, 
          backgroundColor: theme.palette.grey[50], 
          borderRadius: 2,
          borderLeft: `4px solid ${theme.palette.primary.main}`
        }}>
          <Typography variant="subtitle1" gutterBottom sx={{ 
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            <InfoOutlined color="primary" />
            Notes:
          </Typography>
          <Typography variant="body2" color="textSecondary">
            © 2025 Texel. All rights reserved.  
Texel is a proprietary application owned by Mithileshwaran. Unauthorized use, reproduction, or distribution of any part of this app is strictly prohibited.

          </Typography>
        </Box>
      </CostingSheetContainer>
    </Box>
  );
}

export default DesignDetail;