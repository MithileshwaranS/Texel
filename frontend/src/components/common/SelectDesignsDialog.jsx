import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  TextField,
  Box,
} from "@mui/material";
import { Close as CloseIcon, Search as SearchIcon } from "@mui/icons-material";
import { FaFileExcel } from "react-icons/fa";

export default function SelectDesignsDialog({
  open,
  onClose,
  onConfirm,
  designs,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDesigns, setSelectedDesigns] = useState([]);
  const [filteredDesigns, setFilteredDesigns] = useState(designs);

  useEffect(() => {
    setFilteredDesigns(
      designs.filter((design) =>
        design.designname.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, designs]);

  const handleToggleDesign = (designId) => {
    setSelectedDesigns((prev) =>
      prev.includes(designId)
        ? prev.filter((id) => id !== designId)
        : [...prev, designId]
    );
  };

  const handleSelectAll = () => {
    if (selectedDesigns.length === filteredDesigns.length) {
      setSelectedDesigns([]);
    } else {
      setSelectedDesigns(filteredDesigns.map((d) => d.design_id));
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid",
          borderColor: "divider",
          pb: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <FaFileExcel color="#16a34a" />
          Select Designs to Export
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search designs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={selectedDesigns.length === filteredDesigns.length}
              indeterminate={
                selectedDesigns.length > 0 &&
                selectedDesigns.length < filteredDesigns.length
              }
              onChange={handleSelectAll}
            />
          }
          label={`Select All (${selectedDesigns.length}/${filteredDesigns.length})`}
          sx={{ mb: 1 }}
        />

        <Box
          sx={{
            maxHeight: "300px",
            overflowY: "auto",
            "&::-webkit-scrollbar": {
              width: "6px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "rgba(0,0,0,0.2)",
              borderRadius: "3px",
            },
          }}
        >
          {filteredDesigns.map((design) => (
            <FormControlLabel
              key={design.design_id}
              control={
                <Checkbox
                  checked={selectedDesigns.includes(design.design_id)}
                  onChange={() => handleToggleDesign(design.design_id)}
                />
              }
              label={design.designname}
              sx={{
                display: "block",
                mb: 0.5,
                "&:hover": {
                  backgroundColor: "action.hover",
                  borderRadius: 1,
                },
              }}
            />
          ))}
        </Box>
      </DialogContent>

      <DialogActions
        sx={{ p: 2, borderTop: "1px solid", borderColor: "divider" }}
      >
        <Button onClick={onClose} variant="outlined" sx={{ borderRadius: 2 }}>
          Cancel
        </Button>
        <Button
          onClick={() => onConfirm(selectedDesigns)}
          variant="contained"
          disabled={selectedDesigns.length === 0}
          startIcon={<FaFileExcel />}
          sx={{
            borderRadius: 2,
            bgcolor: "#16a34a",
            "&:hover": {
              bgcolor: "#15803d",
            },
          }}
        >
          Export Selected
        </Button>
      </DialogActions>
    </Dialog>
  );
}
