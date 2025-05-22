import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import Spinner from "./Spinner";
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
  Chip,
  Divider,
  Tooltip,
  Zoom,
  Fade,
} from "@mui/material";
import {
  ArrowBack,
  PictureAsPdf,
  MoreVert,
  InfoOutlined,
  AttachMoney,
  LocalShipping,
  Palette,
  Receipt,
  FiberManualRecord,
} from "@mui/icons-material";
import "jspdf-autotable";

// Modern styled components with animations
const CostingSheetContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(4),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[3],
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
  position: "relative",
  border: `1px solid ${theme.palette.divider}`,
  transition: "all 0.3s ease",
  "&:hover": {
    boxShadow: theme.shadows[6],
  },
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2),
  },
}));

const SectionHeader = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  marginBottom: theme.spacing(3),
  color: theme.palette.text.primary,
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1.5),
  fontSize: "1.25rem",
  position: "relative",
  "& svg": {
    color: theme.palette.primary.main,
  },
  "&:after": {
    content: '""',
    position: "absolute",
    bottom: -8,
    left: 0,
    width: "50px",
    height: "4px",
    // backgroundColor: theme.palette.primary.main,
    borderRadius: "2px",
  },
}));

const CostTable = styled(Table)(({ theme }) => ({
  "& .MuiTableCell-root": {
    padding: theme.spacing(1.75),
    borderBottom: `1px solid ${theme.palette.divider}`,
    fontSize: "0.9rem",
    transition: "all 0.2s ease",
  },
  "& .MuiTableCell-head": {
    fontWeight: 700,
    backgroundColor: theme.palette.grey[100],
    color: theme.palette.text.primary,
    fontSize: "0.85rem",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  "& .MuiTableRow-root:hover": {
    "& .MuiTableCell-root": {
      backgroundColor: theme.palette.action.hover,
    },
  },
}));

const TotalRow = styled(TableRow)(({ theme }) => ({
  "& .MuiTableCell-root": {
    fontWeight: 600,
    backgroundColor: theme.palette.grey[50],
  },
}));

const FinalTotalRow = styled(TableRow)(({ theme }) => ({
  "& .MuiTableCell-root": {
    fontWeight: 700,
    fontSize: "1rem",
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
}));

const DesignTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  marginBottom: theme.spacing(1),
  fontSize: "2.5rem",

  WebkitBackgroundClip: "text",
  textAlign: "center",
  fontFamily: "'Montserrat', sans-serif",
  letterSpacing: "0.5px",
  textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
  [theme.breakpoints.down("sm")]: {
    fontSize: "2rem",
  },
}));

const DesignSubtitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: theme.spacing(2),
  marginBottom: theme.spacing(4),
  fontSize: "1.15rem",
  fontFamily: "'Roboto', sans-serif",
  fontWeight: 500,
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    alignItems: "center",
    gap: theme.spacing(0.5),
    fontSize: "1rem",
  },
}));

const SubSectionHeader = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  margin: theme.spacing(3, 0, 2),
  color: theme.palette.text.primary,
  fontSize: "1.1rem",
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  "& svg": {
    fontSize: "0.8rem",
    color: theme.palette.primary.main,
  },
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: "12px",
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: theme.shadows[1],
  transition: "all 0.3s ease",
  marginBottom: theme.spacing(4),
  "&:hover": {
    boxShadow: theme.shadows[3],
  },
}));

function DesignDetail() {
  const { designId } = useParams();
  const navigate = useNavigate();
  const [design, setDesign] = useState(null);
  const [wefts, setWefts] = useState([]);
  const [warps, setWarps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const open = Boolean(anchorEl);

  const fetchDesign = async () => {
    try {
      if (!parseInt(designId) || isNaN(designId)) {
        throw new Error("Invalid design number");
      }

      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_BACKEND_URL}/api/designdetails/${designId}`
      );
      if (!response.ok) throw new Error("Design not found");

      const data = await response.json();

      console.log("Fetched data:", data);

      setDesign(data.design?.[0] || null);
      setWefts(data.wefts || []);
      setWarps(data.warps || []);
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

  const handleExportPDF = async () => {
    handleMenuClose();

    const content = document.getElementById("design-content");
    const elementsToHide = document.querySelectorAll(".hide-on-pdf");
    const originalStyles = [];

    // Store original styles and hide elements
    elementsToHide.forEach((element) => {
      originalStyles.push({
        element,
        display: element.style.display,
        visibility: element.style.visibility,
      });
      element.style.display = "none";
    });

    const originalWidth = content.style.width;
    const originalOverflow = content.style.overflow;

    // Set content to full width for PDF generation
    content.style.width = "1200px";
    content.style.overflow = "visible";

    try {
      const canvas = await html2canvas(content, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        scrollX: 0,
        scrollY: 0,
        windowWidth: 1200,
      });

      // Reset original styles and make elements visible again
      content.style.width = originalWidth;
      content.style.overflow = originalOverflow;
      originalStyles.forEach((style) => {
        style.element.style.display = style.display;
        style.element.style.visibility = style.visibility;
      });

      const imgData = canvas.toDataURL("image/jpeg", 1.0);
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Calculate image dimensions to fit A4 page
      const imgWidth = pageWidth - 20; // 10mm margin on each side
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Center the image on the page
      const x = (pageWidth - imgWidth) / 2;
      let y = 10; // Start 10mm from top

      // Add first page
      pdf.addImage(imgData, "JPEG", x, y, imgWidth, imgHeight, "", "FAST");

      // Add additional pages if content is taller than one page
      let heightLeft = imgHeight;
      while (heightLeft >= pageHeight) {
        y = -(pageHeight - 10); // Move "cursor" for new page
        pdf.addPage();
        pdf.addImage(imgData, "JPEG", x, y, imgWidth, imgHeight, "", "FAST");
        heightLeft -= pageHeight;
      }

      pdf.save(`${design.designname || "design"}-costing-sheet.pdf`);
    } catch (err) {
      console.error("PDF Export failed:", err);
      // Reset original styles even if error occurs
      content.style.width = originalWidth;
      content.style.overflow = originalOverflow;
      originalStyles.forEach((style) => {
        style.element.style.display = style.display;
        style.element.style.visibility = style.visibility;
      });
    }
  };

  const formatCurrency = (value) => {
    return parseFloat(value)
      .toLocaleString("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
      })
      .replace("₹", "₹ ");
  };

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: "center" }}>
        <Typography variant="h6" color="error" gutterBottom>
          Error Loading Design
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          {error}
        </Typography>
        <Button
          variant="contained"
          startIcon={<ArrowBack />}
          onClick={() => navigate("/reports")}
          sx={{
            borderRadius: "8px",
            textTransform: "none",
            boxShadow: "none",
          }}
        >
          Back to Reports
        </Button>
      </Container>
    );
  }

  if (loading) {
    return <Spinner variant="gradient" size="large" fullscreen />;
  }

  if (!design) {
    return null;
  }

  return (
    <Fade in={!loading} timeout={500}>
      <Box
        sx={{
          backgroundColor: theme.palette.grey[50],
          minHeight: "100vh",
          py: 4,
        }}
        id="design-content"
      >
        <CostingSheetContainer maxWidth="lg">
          {/* Header with actions - will be hidden in PDF */}
          <Box
            className="hide-on-pdf"
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 4,
              flexDirection: isMobile ? "column" : "row",
              gap: isMobile ? 2 : 0,
            }}
          >
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={() => navigate("/reports")}
              sx={{
                borderRadius: "8px",
                textTransform: "none",
                alignSelf: isMobile ? "stretch" : "flex-start",
              }}
            >
              Back to Reports
            </Button>

            <Box sx={{ display: "flex", gap: 1 }}>
              <Tooltip title="Export as PDF" TransitionComponent={Zoom}>
                <Button
                  variant="contained"
                  startIcon={<PictureAsPdf />}
                  onClick={handleExportPDF}
                  sx={{
                    borderRadius: "8px",
                    textTransform: "none",
                    boxShadow: "none",
                  }}
                >
                  {isMobile ? "PDF" : "Export PDF"}
                </Button>
              </Tooltip>
              <Tooltip title="More options" TransitionComponent={Zoom}>
                <IconButton
                  aria-label="more"
                  aria-controls="export-menu"
                  aria-haspopup="true"
                  onClick={handleMenuClick}
                  sx={{
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: "8px",
                  }}
                >
                  <MoreVert />
                </IconButton>
              </Tooltip>
              <Menu
                id="export-menu"
                anchorEl={anchorEl}
                keepMounted
                open={open}
                onClose={handleMenuClose}
                PaperProps={{
                  style: {
                    width: 200,
                    borderRadius: "12px",
                    boxShadow: theme.shadows[4],
                  },
                }}
                TransitionComponent={Fade}
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

          <Box sx={{ mb: 4, position: "relative" }}>
            <Typography
              variant="body1"
              sx={{
                position: "absolute",
                top: 0,
                right: 0,
                fontWeight: 600,
                fontSize: "1.25rem",
              }}
            >
              Date: {formatDate(design.created_date)}
            </Typography>

            <Chip
              className="hide-on-pdf"
              label="Costing Sheet"
              size="small"
              color="primary"
              variant="outlined"
              sx={{
                mb: 2,
                fontWeight: 600,
                letterSpacing: "0.5px",
                fontSize: "0.8rem",
              }}
            />
            <DesignTitle variant="h4" sx={{ textAlign: "center" }}>
              {design.designname}
            </DesignTitle>
          </Box>
          {/* Basic Specifications */}
          <Box sx={{ mb: 4 }}>
            <SectionHeader variant="h6">
              <InfoOutlined fontSize="small" />
              Fabric Specifications
            </SectionHeader>
            <StyledTableContainer component={Paper}>
              <CostTable>
                <TableHead>
                  <TableRow>
                    <TableCell>Width</TableCell>
                    <TableCell align="right">{design.width} inch</TableCell>
                  </TableRow>
                </TableHead>
              </CostTable>
            </StyledTableContainer>
          </Box>
          {/* Warp Details */}
          {warps.length > 0 && (
            <Box sx={{ mb: 4 }}>
              <SectionHeader variant="h6">
                <LocalShipping fontSize="small" />
                Warp Details
              </SectionHeader>

              <StyledTableContainer component={Paper}>
                <CostTable>
                  <TableHead>
                    <TableRow>
                      <TableCell>#</TableCell>
                      <TableCell>Count</TableCell>
                      <TableCell align="right">Reed</TableCell>
                      <TableCell align="right">Weight</TableCell>
                      <TableCell align="right">Warp Cost</TableCell>
                      <TableCell align="right">Dyeing Cost</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {warps.map((warp, index) => (
                      <TableRow key={warp.warp_id} hover>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{warp.warpcount}</TableCell>
                        <TableCell align="right">{warp.reed}</TableCell>
                        <TableCell align="right">
                          {Number(warp.warpweight).toFixed(3)}
                        </TableCell>
                        <TableCell align="right">
                          {formatCurrency(warp.initwarpcost)}
                        </TableCell>
                        <TableCell align="right">
                          {formatCurrency(warp.warpdyeing)}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TotalRow>
                      <TableCell colSpan={5} align="right">
                        Total Warp Cost
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700 }}>
                        {formatCurrency(design.warpcost)}
                      </TableCell>
                    </TotalRow>
                  </TableBody>
                </CostTable>
              </StyledTableContainer>
            </Box>
          )}
          {/* Weft Details */}
          {wefts.length > 0 && (
            <Box sx={{ mb: 4 }}>
              <SectionHeader variant="h6">
                <LocalShipping fontSize="small" />
                Weft Details
              </SectionHeader>

              <StyledTableContainer component={Paper}>
                <CostTable>
                  <TableHead>
                    <TableRow>
                      <TableCell>#</TableCell>
                      <TableCell>Count</TableCell>
                      <TableCell align="right">Pick</TableCell>
                      <TableCell align="right">Weight</TableCell>
                      <TableCell align="right">Weft Cost</TableCell>
                      <TableCell align="right">Dyeing Cost</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {wefts.map((weft, index) => (
                      <TableRow key={weft.weft_id} hover>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{weft.weftcount}</TableCell>
                        <TableCell align="right">{weft.pick}</TableCell>

                        <TableCell align="right">
                          {Number(weft.weftweight).toFixed(3)}
                        </TableCell>
                        <TableCell align="right">
                          {formatCurrency(weft.initweftcost)}
                        </TableCell>
                        <TableCell align="right">
                          {formatCurrency(weft.weftdyeing)}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TotalRow>
                      <TableCell colSpan={5} align="right">
                        Total Weft Cost
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700 }}>
                        {formatCurrency(design.weftcost)}
                      </TableCell>
                    </TotalRow>
                  </TableBody>
                </CostTable>
              </StyledTableContainer>
            </Box>
          )}
          {/* Cost Breakdown */}
          <Box sx={{ mb: 4 }}>
            <SectionHeader variant="h6">
              <AttachMoney fontSize="small" />
              Cost Breakdown
            </SectionHeader>
            <StyledTableContainer component={Paper}>
              <CostTable>
                <TableHead>
                  <TableRow>
                    <TableCell>Cost Type</TableCell>
                    <TableCell align="right">Amount (₹)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow hover>
                    <TableCell>Weaving Cost</TableCell>
                    <TableCell align="right">
                      {formatCurrency(design.weavingcost)}
                    </TableCell>
                  </TableRow>
                  <TableRow hover>
                    <TableCell>Washing Cost</TableCell>
                    <TableCell align="right">
                      {formatCurrency(design.washingcost)}
                    </TableCell>
                  </TableRow>
                  {design.mendingcost > 0 && (
                    <TableRow hover>
                      <TableCell>Mending Cost</TableCell>
                      <TableCell align="right">
                        {formatCurrency(design.mendingcost)}
                      </TableCell>
                    </TableRow>
                  )}
                  {design.twistingcost > 0 && (
                    <TableRow hover>
                      <TableCell>Twisting Cost</TableCell>
                      <TableCell align="right">
                        {formatCurrency(design.twistingcost)}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </CostTable>
            </StyledTableContainer>
          </Box>
          {/* Financial Summary */}
          <Box sx={{ mb: 4 }}>
            <SectionHeader variant="h6">
              <Receipt fontSize="small" />
              Financial Summary
            </SectionHeader>
            <StyledTableContainer component={Paper}>
              <CostTable>
                <TableHead>
                  <TableRow>
                    <TableCell>Item</TableCell>
                    <TableCell align="right">Amount (₹)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow hover>
                    <TableCell>Subtotal</TableCell>
                    <TableCell align="right">
                      {formatCurrency(
                        parseFloat(design.warpcost) +
                          parseFloat(design.weftcost) +
                          parseFloat(design.weavingcost) +
                          parseFloat(design.washingcost) +
                          parseFloat(design.mendingcost)
                      )}
                    </TableCell>
                  </TableRow>

                  <TableRow hover>
                    <TableCell>
                      Profit ({formatCurrency(design.profitpercent * 100)}%)
                    </TableCell>
                    <TableCell align="right">
                      {formatCurrency(design.profit)}
                    </TableCell>
                  </TableRow>
                  <TableRow hover>
                    <TableCell>Transport</TableCell>
                    <TableCell align="right">
                      {formatCurrency(design.transportcost)}
                    </TableCell>
                  </TableRow>

                  <TableRow hover>
                    <TableCell>GST</TableCell>
                    <TableCell align="right">
                      {formatCurrency(design.gst)}
                    </TableCell>
                  </TableRow>

                  <FinalTotalRow>
                    <TableCell>Final Total</TableCell>
                    <TableCell align="right">
                      {formatCurrency(design.finaltotal)}
                    </TableCell>
                  </FinalTotalRow>
                </TableBody>
              </CostTable>
            </StyledTableContainer>
          </Box>
          {/* Footer Note */}
          <Box
            sx={{
              mt: 4,
              p: 2,
              backgroundColor: theme.palette.grey[100],
              borderRadius: "12px",
              textAlign: "center",
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Typography variant="caption" color="textSecondary">
              © {new Date().getFullYear()} Texel. All rights reserved. This is a
              proprietary application owned by Mithileshwaran and Team
            </Typography>
          </Box>
        </CostingSheetContainer>
      </Box>
    </Fade>
  );
}

export default DesignDetail;
