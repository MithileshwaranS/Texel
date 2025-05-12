import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  Container, 
  Grid, 
  Paper, 
  Divider, 
  Chip,
  Avatar,
  Skeleton,
  Fade,
  Slide,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Tooltip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  ArrowBack,
  Straighten,
  Schedule,
  AttachMoney,
  LocalShipping,
  Palette,
  Timeline,
  ShowChart,
  Receipt,
  Calculate,
  FiberManualRecord
} from '@mui/icons-material';
import { keyframes } from '@emotion/react';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[4],
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[8],
  },
  animation: `${fadeIn} 0.6s ease-out forwards`
}));

const DetailHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(4),
  gap: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    textAlign: 'center'
  }
}));

const InfoCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  transition: 'all 0.3s ease',
  height: '100%',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[6],
    backgroundColor: theme.palette.background.paper
  }
}));

const CostBadge = styled(Chip)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(-1),
  right: theme.spacing(-1),
  fontWeight: 'bold',
  fontSize: '0.8rem',
  backgroundColor: theme.palette.success.main,
  color: theme.palette.success.contrastText
}));

const HighlightText = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: theme.palette.primary.main,
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing(0.5)
}));

function DesignDetail() {
  const {designId}  = useParams();
  const navigate = useNavigate();
  const [design, setDesign] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);





const fetchDesign = async () => {
  try {
    console.log(designId);
    if (!parseInt(designId) || isNaN(designId)) {
      throw new Error('Invalid design number');
    }

    setLoading(true);
    const response = await fetch(`http://localhost:3000/api/designdetails/${designId}`);
    if (!response.ok) throw new Error('Design not found');
    const data = await response.json();
    setDesign(data.length > 0 ? data[0] : null);
    console.log(design); // Debug output to ensure data is fetched correctly
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

useEffect(()=>{
    fetchDesign();
},[])
useEffect(() => {
    if(design)
  console.log("Updated design state:", design);
}, [design]);

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
        <Grid container spacing={4}>
          <Grid xs={12}>
            <Skeleton variant="rectangular" height={100} animation="wave" />
          </Grid>
          {[...Array(6)].map((_, i) => (
            <Grid xs={12} md={6} lg={4} key={i}>
              <Skeleton variant="rectangular" height={200} animation="wave" />
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  if (!design) {
    return null;
  }

  // Helper function to format currency
  const formatCurrency = (value) => {
    return parseFloat(value).toFixed(2);
  };
  

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Slide direction="down" in={true} mountOnEnter unmountOnExit>
        <Box sx={{ mb: 4 }}>
          <Button 
            variant="outlined" 
            startIcon={<ArrowBack />}
            onClick={() => navigate('/reports')}
            sx={{ 
              mb: 2,
              '&:hover': {
                backgroundColor: 'primary.main',
                color: 'white'
              }
            }}
          >
            Back to All Designs
          </Button>
        </Box>
      </Slide>

      <Fade in={true} timeout={800}>
        <Box>
          <DetailHeader>
            <Avatar 
              sx={{ 
                width: 80, 
                height: 80, 
                bgcolor: 'primary.main',
                fontSize: '2rem',
                boxShadow: 3
              }}
            >
              {design.designname || ""}
           
            </Avatar>
            <Box>
              <Typography variant="h3" component="h1" gutterBottom>
                {design.designname}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Fabric Design Specifications
              </Typography>
            </Box>
          </DetailHeader>

          <Grid container spacing={4}>
            {/* Basic Specifications */}
            <Grid xs={12} md={6}>
              <InfoCard elevation={3}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Straighten color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Basic Specifications</Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                
                <TableContainer>
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell>
                          <Typography variant="subtitle2">Width</Typography>
                        </TableCell>
                        <TableCell>
                          <HighlightText>{design.width} cm</HighlightText>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Typography variant="subtitle2">Reed</Typography>
                        </TableCell>
                        <TableCell>
                          <HighlightText>{design.reed}</HighlightText>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Typography variant="subtitle2">Pick</Typography>
                        </TableCell>
                        <TableCell>
                          <HighlightText>{design.pick}</HighlightText>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Typography variant="subtitle2">Warp Count</Typography>
                        </TableCell>
                        <TableCell>
                          <HighlightText>{design.warpcount}</HighlightText>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Typography variant="subtitle2">Weft Count</Typography>
                        </TableCell>
                        <TableCell>
                          <HighlightText>{design.weftcount}</HighlightText>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </InfoCard>
            </Grid>

            {/* Weight Details */}
            <Grid xs={12} md={6}>
              <InfoCard elevation={3}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Timeline color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Weight Details</Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                
                <TableContainer>
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell>
                          <Typography variant="subtitle2">Warp Weight</Typography>
                        </TableCell>
                        <TableCell>
                          <HighlightText>{design.warpweight} kg</HighlightText>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Typography variant="subtitle2">Weft Weight</Typography>
                        </TableCell>
                        <TableCell>
                          <HighlightText>{design.weftweight} kg</HighlightText>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </InfoCard>
            </Grid>

            {/* Cost Breakdown */}
            <Grid xs={12} md={6}>
              <InfoCard elevation={3} sx={{ position: 'relative' }}>
                <CostBadge label="Cost Breakdown" />
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AttachMoney color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Cost Details</Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                
                <TableContainer>
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell>
                          <Typography variant="subtitle2">Warp Cost</Typography>
                        </TableCell>
                        <TableCell>
                          <HighlightText>₹{formatCurrency(design.warpcost)}</HighlightText>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Typography variant="subtitle2">Weft Cost</Typography>
                        </TableCell>
                        <TableCell>
                          <HighlightText>₹{formatCurrency(design.weftcost)}</HighlightText>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Typography variant="subtitle2">Weaving Cost</Typography>
                        </TableCell>
                        <TableCell>
                          <HighlightText>₹{formatCurrency(design.weavingcost)}</HighlightText>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Typography variant="subtitle2">Washing Cost</Typography>
                        </TableCell>
                        <TableCell>
                          <HighlightText>₹{formatCurrency(design.washingcost)}</HighlightText>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Typography variant="subtitle2">Transport Cost</Typography>
                        </TableCell>
                        <TableCell>
                          <HighlightText>₹{formatCurrency(design.transportcost)}</HighlightText>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Typography variant="subtitle2">Mending Cost</Typography>
                        </TableCell>
                        <TableCell>
                          <HighlightText>₹{formatCurrency(design.mendingcost || 0)}</HighlightText>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Typography variant="subtitle2">Twisiting Cost</Typography>
                        </TableCell>
                        <TableCell>
                          <HighlightText>₹{formatCurrency(design.twistingcost || 0)}</HighlightText>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </InfoCard>
            </Grid>

            {/* Dyeing Costs */}
            <Grid xs={12} md={6}>
              <InfoCard elevation={3}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Palette color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Dyeing Costs</Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                
                <TableContainer>
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell>
                          <Typography variant="subtitle2">Warp Dyeing</Typography>
                        </TableCell>
                        <TableCell>
                          <HighlightText>₹{formatCurrency(design.warpdyeing)}</HighlightText>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Typography variant="subtitle2">Weft Dyeing</Typography>
                        </TableCell>
                        <TableCell>
                          <HighlightText>₹{formatCurrency(design.weftdyeing)}</HighlightText>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Typography variant="subtitle2">Initial Warp Cost</Typography>
                        </TableCell>
                        <TableCell>
                          <HighlightText>₹{formatCurrency(design.initwarpcost)}</HighlightText>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Typography variant="subtitle2">Initial Weft Cost</Typography>
                        </TableCell>
                        <TableCell>
                          <HighlightText>₹{formatCurrency(design.initweftcost)}</HighlightText>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </InfoCard>
            </Grid>

            {/* Financial Summary */}
            <Grid xs={12} md={6}>
              <InfoCard elevation={3}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <ShowChart color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Financial Summary</Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                
                <TableContainer>
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell>
                          <Typography variant="subtitle2">Profit</Typography>
                        </TableCell>
                        <TableCell>
                          <HighlightText>₹{formatCurrency(design.profit)}</HighlightText>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Typography variant="subtitle2">Total Cost</Typography>
                        </TableCell>
                        <TableCell>
                          <HighlightText>₹{formatCurrency(design.totalcost)}</HighlightText>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Typography variant="subtitle2">GST</Typography>
                        </TableCell>
                        <TableCell>
                          <HighlightText>₹{formatCurrency(design.gst)}</HighlightText>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </InfoCard>
            </Grid>

            {/* Final Pricing */}
            <Grid xs={12} md={6}>
              <InfoCard elevation={3} sx={{ 
                backgroundColor: 'primary.light', 
                backgroundImage: 'linear-gradient(to right, rgba(25, 118, 210, 0.1), rgba(25, 118, 210, 0.05))',
                border: '1px solid',
                borderColor: 'primary.main'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Receipt color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Final Pricing</Typography>
                </Box>
                <Divider sx={{ my: 2, borderColor: 'primary.main' }} />
                
                <Box sx={{ textAlign: 'center', py: 2 }}>
                  <Tooltip title="Inclusive of all costs and taxes" arrow>
                    <Typography variant="h4" sx={{ 
                      fontWeight: 'bold',
                      color: 'primary.dark',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 1
                    }}>
                      <FiberManualRecord sx={{ fontSize: '0.8rem' }} />
                      ₹{formatCurrency(design.finaltotal)}
                    </Typography>
                  </Tooltip>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Final price per unit
                  </Typography>
                </Box>
              </InfoCard>
            </Grid>
          </Grid>
        </Box>
      </Fade>
    </Container>
 
  );
}

export default DesignDetail;