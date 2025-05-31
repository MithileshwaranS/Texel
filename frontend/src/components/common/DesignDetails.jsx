import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
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
  Tabs,
  Tab,
  Avatar,
  CircularProgress,
  Badge,
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
  ColorLens,
  ListAlt,
} from "@mui/icons-material";
import { FaFileExcel } from "react-icons/fa";
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
    backgroundColor: theme.palette.primary.main,
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
  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  textAlign: "center",
  fontFamily: "'Montserrat', sans-serif",
  letterSpacing: "0.5px",
  textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
  [theme.breakpoints.down("sm")]: {
    fontSize: "2rem",
  },
}));

const ColorTab = styled(Tab)(({ theme }) => ({
  minWidth: 120,
  margin: theme.spacing(0, 1),
  borderRadius: "8px",
  textTransform: "none",
  "&.Mui-selected": {
    backgroundColor: theme.palette.action.selected,
    fontWeight: 600,
  },
}));

const ColorIndicator = styled("span")(({ color }) => ({
  display: "inline-block",
  width: 16,
  height: 16,
  borderRadius: "50%",
  backgroundColor: color,
  marginRight: 8,
  border: "1px solid rgba(0,0,0,0.1)",
}));

function DesignDetails() {
  const { designId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const tab = location.state?.tab || "cost";
  const [design, setDesign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeColorTab, setActiveColorTab] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Mock data - replace with your actual API calls
  const mockDesign = {
    id: designId,
    designname: "Floral Elegance",
    width: "54",
    created_date: new Date().toISOString(),
    colors: [
      {
        id: 1,
        name: "Sky Blue",
        code: "#87CEEB",
        warps: [
          {
            id: 1,
            count: "40s",
            reed: 120,
            weight: 2.345,
            cost: 125.5,
            dyeing: 45.2,
            individualCost: 170.7,
          },
          {
            id: 2,
            count: "60s",
            reed: 80,
            weight: 1.876,
            cost: 98.3,
            dyeing: 38.5,
            individualCost: 136.8,
          },
        ],
        wefts: [
          {
            id: 1,
            count: "30s",
            pick: 80,
            weight: 3.215,
            cost: 145.75,
            dyeing: 52.3,
            individualCost: 198.05,
          },
        ],
      },
      {
        id: 2,
        name: "Rose Pink",
        code: "#FF66B2",
        warps: [
          {
            id: 3,
            count: "50s",
            reed: 100,
            weight: 2.112,
            cost: 110.25,
            dyeing: 42.8,
            individualCost: 153.05,
          },
        ],
        wefts: [
          {
            id: 2,
            count: "40s",
            pick: 90,
            weight: 2.876,
            cost: 132.4,
            dyeing: 48.6,
            individualCost: 181.0,
          },
          {
            id: 3,
            count: "20s",
            pick: 70,
            weight: 3.542,
            cost: 165.8,
            dyeing: 62.4,
            individualCost: 228.2,
          },
        ],
      },
      {
        id: 3,
        name: "Emerald Green",
        code: "#50C878",
        warps: [
          {
            id: 4,
            count: "80s",
            reed: 90,
            weight: 1.654,
            cost: 85.6,
            dyeing: 35.2,
            individualCost: 120.8,
          },
          {
            id: 5,
            count: "40s",
            reed: 110,
            weight: 2.432,
            cost: 120.3,
            dyeing: 46.8,
            individualCost: 167.1,
          },
        ],
        wefts: [
          {
            id: 4,
            count: "60s",
            pick: 85,
            weight: 2.123,
            cost: 98.7,
            dyeing: 40.2,
            individualCost: 138.9,
          },
        ],
      },
    ],
    weavingCost: 45.75,
    washingCost: 12.5,
    mendingCost: 8.25,
    twistingCost: 0,
    profitPercent: 0.15,
    profit: 78.42,
    transportCost: 25.0,
    gst: 56.38,
    finalTotal: 482.55,
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const open = Boolean(anchorEl);

  const fetchDesign = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.VITE_API_BACKEND_URL}/api/designs/${designId}`
      );
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setDesign(mockDesign);
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
      const imgWidth = pageWidth - 20;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const x = (pageWidth - imgWidth) / 2;
      let y = 10;

      pdf.addImage(imgData, "JPEG", x, y, imgWidth, imgHeight, "", "FAST");

      let heightLeft = imgHeight;
      while (heightLeft >= pageHeight) {
        y = -(pageHeight - 10);
        pdf.addPage();
        pdf.addImage(imgData, "JPEG", x, y, imgWidth, imgHeight, "", "FAST");
        heightLeft -= pageHeight;
      }

      pdf.save(`${design.designname || "design"}-costing-sheet.pdf`);
    } catch (err) {
      console.error("PDF Export failed:", err);
      content.style.width = originalWidth;
      content.style.overflow = originalOverflow;
      originalStyles.forEach((style) => {
        style.element.style.display = style.display;
        style.element.style.visibility = style.visibility;
      });
    }
  };

  const handleExcelExport = async () => {
    handleMenuClose();
    // Simulate Excel export
    console.log("Exporting to Excel...");
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

  const handleColorTabChange = (event, newValue) => {
    setActiveColorTab(newValue);
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
          onClick={() => navigate("/reports", { state: { tab } })}
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

  const activeColor = design.colors[activeColorTab];

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
          {/* Header with actions */}
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
              onClick={() => navigate("/reports", { state: { tab } })}
              sx={{
                borderRadius: "8px",
                textTransform: "none",
                alignSelf: isMobile ? "stretch" : "flex-start",
              }}
            >
              Back to Reports
            </Button>

            <Box sx={{ display: "flex", gap: 1 }}>
              <Tooltip title="Export as Excel" TransitionComponent={Zoom}>
                <Button
                  variant="contained"
                  startIcon={<FaFileExcel />}
                  onClick={handleExcelExport}
                  sx={{
                    borderRadius: "8px",
                    textTransform: "none",
                    boxShadow: "none",
                    bgcolor: "#16a34a",
                    "&:hover": {
                      bgcolor: "#15803d",
                    },
                  }}
                >
                  {isMobile ? "Excel" : "Export Excel"}
                </Button>
              </Tooltip>

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

          {/* Color Tabs */}
          <Box sx={{ mb: 4 }}>
            <SectionHeader variant="h6">
              <ColorLens fontSize="small" />
              Color Variations
            </SectionHeader>

            <Paper sx={{ mb: 3, borderRadius: "12px", overflow: "hidden" }}>
              <Tabs
                value={activeColorTab}
                onChange={handleColorTabChange}
                variant="scrollable"
                scrollButtons="auto"
                aria-label="color tabs"
                sx={{
                  "& .MuiTabs-indicator": {
                    height: 4,
                    borderRadius: "2px 2px 0 0",
                  },
                }}
              >
                {design.colors.map((color, index) => (
                  <ColorTab
                    key={color.id}
                    label={
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <ColorIndicator color={color.code} />
                        {color.name}
                      </Box>
                    }
                    icon={
                      <Badge
                        badgeContent={color.warps.length + color.wefts.length}
                        color="primary"
                        overlap="circular"
                        sx={{
                          "& .MuiBadge-badge": {
                            right: -5,
                            top: -5,
                            fontSize: "0.6rem",
                            height: 18,
                            minWidth: 18,
                          },
                        }}
                      />
                    }
                    iconPosition="end"
                  />
                ))}
              </Tabs>
            </Paper>

            {/* Active Color Details */}
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h6"
                sx={{ mb: 2, display: "flex", alignItems: "center" }}
              >
                <ColorIndicator color={activeColor.code} />
                {activeColor.name}
                <Chip
                  label={`Color ${activeColorTab + 1} of ${
                    design.colors.length
                  }`}
                  size="small"
                  sx={{ ml: 2 }}
                />
              </Typography>

              {/* Warp Details for Active Color */}
              {activeColor.warps.length > 0 && (
                <Box sx={{ mb: 4 }}>
                  <SectionHeader variant="h6">
                    <ListAlt fontSize="small" />
                    Warp Details
                  </SectionHeader>

                  <TableContainer
                    component={Paper}
                    sx={{ borderRadius: "12px", mb: 3 }}
                  >
                    <CostTable>
                      <TableHead>
                        <TableRow>
                          <TableCell>#</TableCell>
                          <TableCell>Count</TableCell>
                          <TableCell align="right">Reed</TableCell>
                          <TableCell align="right">Weight (kg)</TableCell>
                          <TableCell align="right">Warp Cost</TableCell>
                          <TableCell align="right">Dyeing Cost</TableCell>
                          <TableCell align="right">Total Cost</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {activeColor.warps.map((warp, index) => (
                          <TableRow key={warp.id} hover>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{warp.count}</TableCell>
                            <TableCell align="right">{warp.reed}</TableCell>
                            <TableCell align="right">
                              {warp.weight.toFixed(3)}
                            </TableCell>
                            <TableCell align="right">
                              {formatCurrency(warp.cost)}
                            </TableCell>
                            <TableCell align="right">
                              {formatCurrency(warp.dyeing)}
                            </TableCell>
                            <TableCell align="right">
                              {formatCurrency(warp.individualCost)}
                            </TableCell>
                          </TableRow>
                        ))}
                        <TotalRow>
                          <TableCell colSpan={6} align="right">
                            Subtotal
                          </TableCell>
                          <TableCell align="right">
                            {formatCurrency(
                              activeColor.warps.reduce(
                                (sum, warp) => sum + warp.individualCost,
                                0
                              )
                            )}
                          </TableCell>
                        </TotalRow>
                      </TableBody>
                    </CostTable>
                  </TableContainer>
                </Box>
              )}

              {/* Weft Details for Active Color */}
              {activeColor.wefts.length > 0 && (
                <Box sx={{ mb: 4 }}>
                  <SectionHeader variant="h6">
                    <ListAlt fontSize="small" />
                    Weft Details
                  </SectionHeader>

                  <TableContainer
                    component={Paper}
                    sx={{ borderRadius: "12px", mb: 3 }}
                  >
                    <CostTable>
                      <TableHead>
                        <TableRow>
                          <TableCell>#</TableCell>
                          <TableCell>Count</TableCell>
                          <TableCell align="right">Pick</TableCell>
                          <TableCell align="right">Weight (kg)</TableCell>
                          <TableCell align="right">Weft Cost</TableCell>
                          <TableCell align="right">Dyeing Cost</TableCell>
                          <TableCell align="right">Total Cost</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {activeColor.wefts.map((weft, index) => (
                          <TableRow key={weft.id} hover>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{weft.count}</TableCell>
                            <TableCell align="right">{weft.pick}</TableCell>
                            <TableCell align="right">
                              {weft.weight.toFixed(3)}
                            </TableCell>
                            <TableCell align="right">
                              {formatCurrency(weft.cost)}
                            </TableCell>
                            <TableCell align="right">
                              {formatCurrency(weft.dyeing)}
                            </TableCell>
                            <TableCell align="right">
                              {formatCurrency(weft.individualCost)}
                            </TableCell>
                          </TableRow>
                        ))}
                        <TotalRow>
                          <TableCell colSpan={6} align="right">
                            Subtotal
                          </TableCell>
                          <TableCell align="right">
                            {formatCurrency(
                              activeColor.wefts.reduce(
                                (sum, weft) => sum + weft.individualCost,
                                0
                              )
                            )}
                          </TableCell>
                        </TotalRow>
                      </TableBody>
                    </CostTable>
                  </TableContainer>
                </Box>
              )}
            </Box>
          </Box>

          {/* Fabric Specifications */}
          <Box sx={{ mb: 4 }}>
            <SectionHeader variant="h6">
              <InfoOutlined fontSize="small" />
              Fabric Specifications
            </SectionHeader>
            <TableContainer component={Paper} sx={{ borderRadius: "12px" }}>
              <CostTable>
                <TableHead>
                  <TableRow>
                    <TableCell>Width</TableCell>
                    <TableCell align="right">{design.width} inch</TableCell>
                  </TableRow>
                </TableHead>
              </CostTable>
            </TableContainer>
          </Box>

          {/* Cost Breakdown */}
          <Box sx={{ mb: 4 }}>
            <SectionHeader variant="h6">
              <AttachMoney fontSize="small" />
              Cost Breakdown
            </SectionHeader>
            <TableContainer component={Paper} sx={{ borderRadius: "12px" }}>
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
                      {formatCurrency(design.weavingCost)}
                    </TableCell>
                  </TableRow>
                  <TableRow hover>
                    <TableCell>Washing Cost</TableCell>
                    <TableCell align="right">
                      {formatCurrency(design.washingCost)}
                    </TableCell>
                  </TableRow>
                  {design.mendingCost > 0 && (
                    <TableRow hover>
                      <TableCell>Mending Cost</TableCell>
                      <TableCell align="right">
                        {formatCurrency(design.mendingCost)}
                      </TableCell>
                    </TableRow>
                  )}
                  {design.twistingCost > 0 && (
                    <TableRow hover>
                      <TableCell>Twisting Cost</TableCell>
                      <TableCell align="right">
                        {formatCurrency(design.twistingCost)}
                      </TableCell>
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
            <TableContainer component={Paper} sx={{ borderRadius: "12px" }}>
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
                        design.finalTotal -
                          design.profit -
                          design.transportCost -
                          design.gst
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow hover>
                    <TableCell>
                      Profit ({design.profitPercent * 100}%)
                    </TableCell>
                    <TableCell align="right">
                      {formatCurrency(design.profit)}
                    </TableCell>
                  </TableRow>
                  <TableRow hover>
                    <TableCell>Transport</TableCell>
                    <TableCell align="right">
                      {formatCurrency(design.transportCost)}
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
                      {formatCurrency(design.finalTotal)}
                    </TableCell>
                  </FinalTotalRow>
                </TableBody>
              </CostTable>
            </TableContainer>
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
              proprietary application owned by Mithileshwaran and Sanjesh
            </Typography>
          </Box>
        </CostingSheetContainer>
      </Box>
    </Fade>
  );
}

export default DesignDetails;
