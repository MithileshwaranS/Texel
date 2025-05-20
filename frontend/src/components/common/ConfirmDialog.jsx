import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  styled,
  useTheme,
  Slide,
  IconButton,
  CircularProgress,
  Box,
  keyframes,
} from "@mui/material";
import { Close, DeleteOutline, Check } from "@mui/icons-material";
import { forwardRef, useState } from "react";

// Animation keyframes
const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const shake = keyframes`
  0% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  50% { transform: translateX(5px); }
  75% { transform: translateX(-5px); }
  100% { transform: translateX(0); }
`;

const checkmark = keyframes`
  0% { transform: scale(0); opacity: 0; }
  80% { transform: scale(1.2); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
`;

// Transition for dialog
const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// Styled components
const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    borderRadius: "16px",
    minWidth: "300px",
    maxWidth: "450px",
    width: "90%",
    padding: theme.spacing(1),
    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
    [theme.breakpoints.down("sm")]: {
      margin: theme.spacing(2),
    },
  },
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: theme.spacing(2),
  paddingBottom: theme.spacing(1),
  "& .MuiTypography-root": {
    fontWeight: 600,
    fontSize: "1.25rem",
    color: theme.palette.error.main,
  },
}));

const DeleteButton = styled(Button)(({ theme, deleting, deletedsuccess }) => ({
  borderRadius: "12px",
  padding: "8px 20px",
  textTransform: "none",
  fontWeight: 500,
  letterSpacing: "0.5px",
  transition: "all 0.3s ease",
  backgroundColor: deletedsuccess
    ? theme.palette.success.main
    : deleting
    ? theme.palette.error.dark
    : theme.palette.error.light,
  color: theme.palette.error.contrastText,
  minWidth: deletedsuccess ? "40px" : "120px",
  animation: deleting ? `${shake} 0.5s ease` : "none",
  "&:hover:not(:disabled)": {
    backgroundColor: theme.palette.error.main,
    transform: "translateY(-1px)",
    boxShadow: `0 2px 8px ${theme.palette.error.main}30`,
    animation: `${pulse} 1.5s infinite`,
  },
  "& .MuiButton-startIcon": {
    transition: "all 0.3s ease",
    transform: deletedsuccess ? "scale(1.5)" : "scale(1)",
  },
}));

const SuccessIcon = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  animation: `${checkmark} 0.5s ease-out`,
  color: theme.palette.success.contrastText,
}));

export default function ConfirmDialog({ open, onClose, onConfirm }) {
  const theme = useTheme();
  const [deleting, setDeleting] = useState(false);
  const [deletedSuccess, setDeletedSuccess] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await onConfirm();
      setDeletedSuccess(true);
      setTimeout(() => {
        setDeletedSuccess(false);
        setDeleting(false);
        onClose();
      }, 1000);
    } catch (error) {
      setDeleting(false);
    }
  };

  return (
    <StyledDialog
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <StyledDialogTitle id="alert-dialog-title">
        <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <DeleteOutline color="error" />
          Delete Confirmation
        </span>
        <IconButton
          aria-label="close"
          onClick={onClose}
          disabled={deleting}
          sx={{
            color: theme.palette.grey[500],
            "&:hover": {
              backgroundColor: theme.palette.grey[100],
              color: theme.palette.grey[700],
            },
          }}
        >
          <Close />
        </IconButton>
      </StyledDialogTitle>

      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {deletedSuccess
            ? "Design deleted successfully!"
            : "Are you sure you want to permanently delete this design? This action cannot be undone."}
        </DialogContentText>
      </DialogContent>

      <DialogActions sx={{ padding: 2, justifyContent: "space-between" }}>
        <Button
          onClick={onClose}
          variant="text"
          disabled={deleting}
          sx={{
            borderRadius: "12px",
            padding: "8px 20px",
            textTransform: "none",
            fontWeight: 500,
            "&:hover": {
              backgroundColor: theme.palette.grey[100],
            },
          }}
        >
          Cancel
        </Button>

        <DeleteButton
          onClick={handleDelete}
          variant="contained"
          startIcon={
            deleting && !deletedSuccess ? (
              <CircularProgress size={20} color="inherit" />
            ) : deletedSuccess ? (
              <SuccessIcon>
                <Check fontSize="small" />
              </SuccessIcon>
            ) : (
              <DeleteOutline fontSize="small" />
            )
          }
          disabled={deleting}
          deleting={deleting}
          deletedsuccess={deletedSuccess}
        >
          {deletedSuccess ? "" : deleting ? "Deleting..." : "Delete"}
        </DeleteButton>
      </DialogActions>
    </StyledDialog>
  );
}
