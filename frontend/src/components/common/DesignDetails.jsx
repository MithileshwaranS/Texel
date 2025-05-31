import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
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
  Container,
  Button,
  Tooltip,
  Zoom,
  CircularProgress,
  Alert,
  styled,
} from "@mui/material";
import { ColorLens, ArrowBack, PictureAsPdf, Info } from "@mui/icons-material";

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

const ColorIndicator = styled("span")(({ color }) => ({
  display: "inline-block",
  width: 10,
  height: 10,
  borderRadius: "50%",
  backgroundColor: color,
  marginRight: 8,
  border: "1px solid rgba(0,0,0,0.1)",
}));
const TotalRow = styled(TableRow)(({ theme }) => ({
  "& .MuiTableCell-root": {
    fontWeight: 600,
    backgroundColor: theme.palette.grey[50],
  },
}));

const SectionHeader = ({ children }) => (
  <Typography
    variant="h6"
    sx={{
      fontWeight: 700,
      marginBottom: 3,
      display: "flex",
      alignItems: "center",
      gap: 1.5,
      fontSize: "1.25rem",
      position: "relative",
      "& svg": {
        color: "primary.main",
      },
      "&:after": {
        content: '""',
        position: "absolute",
        bottom: -8,
        left: 0,
        width: "50px",
        height: "4px",
        backgroundColor: "primary.main",
        borderRadius: "2px",
      },
    }}
  >
    {children}
  </Typography>
);

function DesignDetails() {
  const { designId } = useParams();
  const navigate = useNavigate();
  const [Design, setDesign] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      console.log("Fetching warp color data for design ID:", designId);
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_API_BACKEND_URL
          }/api/getdesigndetails/${designId}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setDesign(data);
        console.log("data:", data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [designId]);

  const handleExportPDF = async () => {
    const content = document.getElementById("warp-color-content");
    const elementsToHide = document.querySelectorAll(".no-print");
    elementsToHide.forEach((el) => (el.style.visibility = "hidden"));

    const canvas = await html2canvas(content, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/jpeg", 1.0);
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const imgWidth = pageWidth - 20;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    const x = (pageWidth - imgWidth) / 2;

    pdf.addImage(imgData, "JPEG", x, 10, imgWidth, imgHeight);
    pdf.save("warp-color-details.pdf");

    elementsToHide.forEach((el) => (el.style.visibility = "visible"));
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: "center" }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Loading warp color data...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          Error loading warp color data: {error}
        </Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() => navigate("/reports", { state: { tab: "cost" } })}
        >
          Back to Reports
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }} id="warp-color-content">
      {/* Header with actions */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
        className="no-print"
      >
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() => navigate("/reports", { state: { tab: "cost" } })}
          sx={{
            borderRadius: "8px",
            textTransform: "none",
          }}
        >
          Back to Reports
        </Button>

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
            Export PDF
          </Button>
        </Tooltip>
      </Box>

      {/* Design Name & Color Name Header */}
      <Box sx={{ textAlign: "center", mb: 3 }}>
        {/* Design Name (Main Title - Larger & Bold) */}
        <Typography
          variant="h4" // Larger size for title
          sx={{
            fontWeight: 800, // Extra bold
            mb: 1, // Space below
          }}
        >
          {Design.designName}
        </Typography>

        {/* Color Name (Secondary - Smaller) */}
        {Design.warpquery && Design.warpquery.length > 0 && (
          <Typography
            variant="h6" // Smaller than title
            sx={{
              fontWeight: 500, // Medium weight (less bold than title)
              color: "text.secondary", // Slightly muted color
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
            }}
          >
            <ColorIndicator color={Design.warpquery[0].colorname} />
            {Design.warpquery[0].colorname}
          </Typography>
        )}
      </Box>

      {/* Warp Information Section */}
      {Design.warpquery && Design.warpquery.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <SectionHeader>
            <Info fontSize="small" />
            Warp Information
          </SectionHeader>

          <Box
            component={Paper}
            sx={{
              borderRadius: "12px",
              p: 3,
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
              mb: 3,
            }}
          >
            <TableContainer>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700, width: "30%" }}>
                      Order Quantity
                    </TableCell>
                    <TableCell sx={{ textAlign: "right" }}>
                      {Design.warpquery[0].totalquantity} m
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Warp Count</TableCell>
                    <TableCell sx={{ textAlign: "right" }}>
                      {Design.warpquery[0].warpcount}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Width</TableCell>
                    <TableCell sx={{ textAlign: "right" }}>
                      {Design.warpquery[0].width} inches
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Warp Weight</TableCell>
                    <TableCell sx={{ textAlign: "right" }}>
                      {Design.warpquery[0].warpweight} kg
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Reed</TableCell>
                    <TableCell sx={{ textAlign: "right" }}>
                      {Design.warpquery[0].reed}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      )}

      {/* Warp Color Table */}
      <Box sx={{ mb: 4 }}>
        <SectionHeader>
          <ColorLens fontSize="small" />
          Warp Color Details
        </SectionHeader>

        {Design.finalvaluequery && Design.finalvaluequery.length === 0 ? (
          <Alert severity="info">No warp color data available</Alert>
        ) : (
          <TableContainer
            component={Paper}
            sx={{
              borderRadius: "12px",
              mb: 3,
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Table>
              <TableHead sx={{ backgroundColor: "grey.100" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Color</TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="right">
                    Color No
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="right">
                    Threads
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="right">
                    Total Threads
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="right">
                    Weight (kg)
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="right">
                    Total Weight (kg)
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Design.finalvaluequery &&
                  Design.finalvaluequery.map((color) => (
                    <TableRow key={color.warpcolorsinfo_id} hover>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <ColorIndicator color={color.colorvalue} />
                          {color.colorlabel}
                        </Box>
                      </TableCell>
                      <TableCell align="right">{color.legend}</TableCell>
                      <TableCell align="right">{color.threads}</TableCell>
                      <TableCell align="right">
                        {color.totalweightthreads || "N/A"}
                      </TableCell>
                      <TableCell align="right">
                        {color.weight?.toFixed(3) || "N/A"}
                      </TableCell>
                      <TableCell align="right">
                        {color.totalweight?.toFixed(3) || "N/A"}
                      </TableCell>
                    </TableRow>
                  ))}
                {/* Totals Row for all columns */}
                {Design.finalvaluequery &&
                  Design.finalvaluequery.length > 0 && (
                    <TotalRow>
                      <TableCell colSpan={2} align="right">
                        Total
                      </TableCell>
                      <TableCell align="right">
                        {Design.warpquery[0].threadperrepeat || "N/A"}
                      </TableCell>
                      <TableCell align="right">
                        {Design.warpquery[0].totalthreads || "N/A"}
                      </TableCell>
                      <TableCell align="right">
                        {Design.warpquery[0].warpweight?.toFixed(3) || "N/A"}
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700 }}>
                        {Design.warpquery[0].ordertotalweight?.toFixed(3) ||
                          "N/A"}
                      </TableCell>
                    </TotalRow>
                  )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Container>
  );
}

export default DesignDetails;
