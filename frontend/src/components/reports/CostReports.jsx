import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import YarnCard from "../common/CardComponent";
import WarpDetails from "./WarpDetails";
import WeftDetails from "./WeftDetails";

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

function CostReports() {
  const [designs, setDesigns] = useState([]);
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDesigns();
  }, []);

  const fetchDesigns = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BACKEND_URL}/api/designswithdetails`
      );
      if (!response.ok) {
        const text = await response.text();
        let errorMsg = `HTTP error! status: ${response.status}`;
        if (text && text.startsWith("<")) {
          errorMsg +=
            " (Received HTML instead of JSON. Backend may be down or endpoint is wrong.)";
        }
        throw new Error(errorMsg);
      }
      let data;
      try {
        data = await response.json();
      } catch (jsonErr) {
        setError("Failed to parse backend response as JSON.");
        console.error("JSON parse error:", jsonErr);
        throw new Error("Invalid JSON from backend.");
      }
      setDesigns(data);
      setError(null);
    } catch (err) {
      setError(
        err.message || "Failed to fetch designs. Please try again later."
      );
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDesign = (design) => {
    setSelectedDesign(design);
    setTabValue(0);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const renderWarpTable = (warps) => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Warp ID</TableCell>
            <TableCell>Color Name</TableCell>
            <TableCell>Warp Count</TableCell>
            <TableCell>Reed</TableCell>
            <TableCell>Wastage</TableCell>
            <TableCell>Total Quantity</TableCell>
            <TableCell>Width</TableCell>
            <TableCell>Total Threads</TableCell>
            <TableCell>Warp Weight</TableCell>
            <TableCell>Thread/Repeat</TableCell>
            <TableCell>Order Total Weight</TableCell>
            <TableCell>Total Weight/Repeat</TableCell>
            <TableCell>Colors</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {warps.map((warp) => (
            <TableRow key={warp.warp_id || warp.id}>
              <TableCell>{warp.warp_id || warp.id}</TableCell>
              <TableCell>{warp.colorname}</TableCell>
              <TableCell>{warp.warpcount}</TableCell>
              <TableCell>{warp.reed}</TableCell>
              <TableCell>{warp.wastage}</TableCell>
              <TableCell>{warp.totalquantity}</TableCell>
              <TableCell>{warp.width}</TableCell>
              <TableCell>{warp.totalthreads}</TableCell>
              <TableCell>{warp.warpweight}</TableCell>
              <TableCell>{warp.threadperrepeat}</TableCell>
              <TableCell>{warp.ordertotalweight}</TableCell>
              <TableCell>{warp.totalweightperrepeat}</TableCell>
              <TableCell>
                {warp.colors && warp.colors.length > 0 ? (
                  <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                    {warp.colors.map((color) => (
                      <li key={color.id}>
                        <span
                          style={{
                            background: color.colorvalue,
                            padding: "0 8px",
                            borderRadius: 4,
                            color: "#222",
                            marginRight: 4,
                          }}
                        >
                          {color.colorlabel}
                        </span>
                        (Legend: {color.legend}, Threads: {color.threads},
                        Weight: {color.weight}, Total Weight:{" "}
                        {color.totalweight})
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span>-</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderWeftTable = (wefts) => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Weft ID</TableCell>
            <TableCell>Color Name</TableCell>
            <TableCell>Weft Count</TableCell>
            <TableCell>Pick</TableCell>
            <TableCell>Wastage</TableCell>
            <TableCell>Total Quantity</TableCell>
            <TableCell>Width</TableCell>
            <TableCell>Total Threads</TableCell>
            <TableCell>Weft Weight</TableCell>
            <TableCell>Thread/Repeat</TableCell>
            <TableCell>Order Total Weight</TableCell>
            <TableCell>Total Weight/Repeat</TableCell>
            <TableCell>Colors</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {wefts.map((weft) => (
            <TableRow key={weft.weft_id || weft.id}>
              <TableCell>{weft.weft_id || weft.id}</TableCell>
              <TableCell>{weft.colorname}</TableCell>
              <TableCell>{weft.weftcount}</TableCell>
              <TableCell>{weft.pick}</TableCell>
              <TableCell>{weft.wastage}</TableCell>
              <TableCell>{weft.totalquantity}</TableCell>
              <TableCell>{weft.width}</TableCell>
              <TableCell>{weft.totalthreads}</TableCell>
              <TableCell>{weft.weftweight}</TableCell>
              <TableCell>{weft.threadperrepeat}</TableCell>
              <TableCell>{weft.ordertotalweight}</TableCell>
              <TableCell>{weft.totalweightperrepeat}</TableCell>
              <TableCell>
                {weft.colors && weft.colors.length > 0 ? (
                  <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                    {weft.colors.map((color) => (
                      <li key={color.id}>
                        <span
                          style={{
                            background: color.colorvalue,
                            padding: "0 8px",
                            borderRadius: 4,
                            color: "#222",
                            marginRight: 4,
                          }}
                        >
                          {color.colorlabel}
                        </span>
                        (Legend: {color.legend}, Threads: {color.threads},
                        Weight: {color.weight}, Total Weight:{" "}
                        {color.totalweight})
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span>-</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Cost Reports
      </Typography>

      {!selectedDesign ? (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 3,
          }}
        >
          {designs.map((design) => (
            <YarnCard
              title={design.designname}
              onViewMore={() => handleViewDesign(design)}
            />
            // <Card key={design.id}>
            //   <CardContent>
            //     <Typography variant="h6">{design.designname}</Typography>
            //     <Typography color="text.secondary">
            //       Warps: {design.warps.length}
            //     </Typography>
            //     <Typography color="text.secondary">
            //       Wefts: {design.wefts.length}
            //     </Typography>
            //   </CardContent>
            //   <CardActions>
            //     <Button size="small" onClick={() => handleViewDesign(design)}>
            //       View Details
            //     </Button>
            //   </CardActions>
            // </Card>
          ))}
        </Box>
      ) : (
        <Box>
          <Box
            sx={{
              mb: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6">{selectedDesign.designname}</Typography>
            <Button onClick={() => setSelectedDesign(null)}>
              Back to List
            </Button>
          </Box>

          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab label="Warps" />
              <Tab label="Wefts" />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            <WarpDetails design={selectedDesign} warps={selectedDesign.warps} />
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <WeftDetails design={selectedDesign} wefts={selectedDesign.wefts} />
          </TabPanel>
        </Box>
      )}
    </Box>
  );
}

export default CostReports;
