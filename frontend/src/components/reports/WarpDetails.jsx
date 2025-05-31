// WarpDetails.jsx
import React, { useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Divider,
  useTheme,
  styled,
  Button,
  IconButton,
  Tooltip,
  useMediaQuery,
} from "@mui/material";
import { FaWeight, FaFileExcel } from "react-icons/fa";
import { LocalShipping, PictureAsPdf, MoreVert } from "@mui/icons-material";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

// Styled components matching the DesignDetail style
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
    borderRadius: "2px",
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

const ExportContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
  gap: theme.spacing(1),
  marginBottom: theme.spacing(3),
}));

const WarpDetails = ({ design, warps }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleExportPDF = async () => {
    handleMenuClose();
    const content = document.getElementById("warp-details-content");
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

      pdf.save(`${design.designname || "warp"}-details.pdf`);
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

  const handleExcelExport = async () => {
    handleMenuClose();
    // Implement Excel export functionality here
    console.log("Excel export would be implemented here");
  };

  return (
    <Box id="warp-details-content">
      <ExportContainer className="hide-on-pdf">
        <Tooltip title="Export as Excel">
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

        <Tooltip title="Export as PDF">
          <Button
            variant="contained"
            startIcon={<PictureAsPdf />}
            onClick={handleExportPDF}
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              boxShadow: "none",
              ml: 1,
            }}
          >
            {isMobile ? "PDF" : "Export PDF"}
          </Button>
        </Tooltip>

        <Tooltip title="More options">
          <IconButton
            aria-label="more"
            aria-controls="export-menu"
            aria-haspopup="true"
            onClick={handleMenuClick}
            sx={{
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: "8px",
              ml: 1,
            }}
          >
            <MoreVert />
          </IconButton>
        </Tooltip>
      </ExportContainer>

      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            marginBottom: theme.spacing(1),
            WebkitBackgroundClip: "text",
            fontFamily: "'Montserrat', sans-serif",
            letterSpacing: "0.5px",
            textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
          }}
        >
          {design.designname}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: theme.palette.text.secondary,
            display: "flex",
            alignItems: "center",
            gap: theme.spacing(2),
            marginBottom: theme.spacing(4),
            fontSize: "1.15rem",
            fontFamily: "'Roboto', sans-serif",
            fontWeight: 500,
          }}
        >
          Reed: {warps[0]?.reed || "N/A"} | Total Width:{" "}
          {warps[0]?.width || "N/A"}
        </Typography>
      </Box>

      <SectionHeader variant="h6">
        <LocalShipping fontSize="small" />
        Warp Details
      </SectionHeader>

      {warps.map((warp, index) => (
        <Box key={warp.warp_id || warp.id || index} sx={{ mb: 4 }}>
          <SubSectionHeader variant="h6" component="h3">
            <FaWeight style={{ color: theme.palette.primary.main }} />
            Warp {index + 1} - {warp.colorname}
          </SubSectionHeader>

          <StyledTableContainer component={Paper}>
            <CostTable>
              <TableHead>
                <TableRow>
                  <TableCell>Color</TableCell>
                  <TableCell align="right">Thread Count</TableCell>
                  <TableCell align="right">Weight (kg)</TableCell>
                  <TableCell align="right">Total Weight (kg)</TableCell>
                  <TableCell align="right">Percentage</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {warp.colors?.map((color) => (
                  <TableRow key={color.id} hover>
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <Box
                          sx={{
                            width: 24,
                            height: 24,
                            borderRadius: "50%",
                            backgroundColor: color.colorvalue,
                            border: `1px solid ${theme.palette.divider}`,
                          }}
                        />
                        <Box>
                          <Typography>{color.colorlabel}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            Color {color.legend}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      {color.threads.toLocaleString()}
                    </TableCell>
                    <TableCell align="right">
                      {parseFloat(color.weight).toFixed(3)}
                    </TableCell>
                    <TableCell align="right">
                      {parseFloat(color.totalweight).toFixed(3)}
                    </TableCell>
                    <TableCell align="right">
                      {((color.threads / warp.totalthreads) * 100).toFixed(2)}%
                    </TableCell>
                  </TableRow>
                ))}
                <TotalRow>
                  <TableCell sx={{ fontWeight: 600 }}>Total</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">
                    {warp.totalthreads.toLocaleString()}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">
                    {parseFloat(warp.warpweight).toFixed(3)}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">
                    {parseFloat(warp.ordertotalweight).toFixed(3)}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">
                    100%
                  </TableCell>
                </TotalRow>
              </TableBody>
            </CostTable>
          </StyledTableContainer>
        </Box>
      ))}
    </Box>
  );
};

export default WarpDetails;
