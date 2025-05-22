import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
  IconButton,
  Chip,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  Favorite,
  Share,
  MoreVert,
  ContentCopy,
  Check,
} from "@mui/icons-material";

const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 320,
  minWidth: 240,
  margin: "0.5rem",
  borderRadius: "16px",
  overflow: "hidden",
  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
  position: "relative",
  backgroundColor: theme.palette.background.paper,
  display: "flex",
  flexDirection: "column",
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: "0 12px 28px rgba(0,0,0,0.12)",
    "& .card-media": {
      transform: "scale(1.03)",
    },
    "& .card-actions": {
      opacity: 1,
    },
  },
}));

const MediaWrapper = styled(Box)({
  overflow: "hidden",
  position: "relative",
  height: "220px",
  borderRadius: "16px 16px 0 0",
  "&::after": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background:
      "linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 40%)",
    zIndex: 1,
  },
});

const StyledCardMedia = styled(CardMedia)({
  transition: "transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
  height: "100%",
  width: "100%",
  objectFit: "cover",
});

const CardActions = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "12px",
  right: "12px",
  display: "flex",
  gap: "4px",
  opacity: 0,
  transition: "opacity 0.3s ease",
  zIndex: 2,
}));

const StatusBadge = styled(Chip)(({ theme, status }) => ({
  position: "absolute",
  top: "12px",
  left: "12px",
  zIndex: 2,
  fontWeight: 600,
  fontSize: "0.7rem",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  padding: "4px 8px",
  borderRadius: "12px",
  ...(status === "pending" && {
    backgroundColor: theme.palette.warning.light,
    color: theme.palette.warning.dark,
  }),
  ...(status === "completed" && {
    backgroundColor: theme.palette.success.light,
    color: theme.palette.success.dark,
  }),
  ...(status === "sent" && {
    backgroundColor: theme.palette.info.light,
    color: theme.palette.info.dark,
  }),
}));

const ActionIconButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: "rgba(255,255,255,0.9)",
  color: theme.palette.text.primary,
  "&:hover": {
    backgroundColor: "rgba(255,255,255,1)",
  },
}));

const BottomContent = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(2),
  flexGrow: 1,
  display: "flex",
  flexDirection: "column",
}));

const TitleRow = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  width: "100%",
  marginBottom: "12px",
});

const TitleText = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  fontSize: "1.1rem",
  color: theme.palette.text.primary,
  flex: 1,
  marginRight: theme.spacing(1),
  wordBreak: "break-word",
}));

const DateText = styled(Typography)(({ theme }) => ({
  fontSize: "0.8rem",
  color: theme.palette.text.secondary,
  whiteSpace: "nowrap",
  paddingTop: "2px",
}));

const DescriptionText = styled(Typography)(({ theme }) => ({
  fontSize: "0.9rem",
  color: theme.palette.text.secondary,
  lineHeight: 1.5,
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
  marginBottom: theme.spacing(2),
}));

const ActionButtons = styled(Box)({
  display: "flex",
  gap: "8px",
  marginTop: "auto",
});

const StyledButton = styled(Button)(({ theme }) => ({
  minWidth: "unset",
  padding: "8px 12px",
  borderRadius: "12px",
  fontWeight: "600",
  fontSize: "0.8rem",
  textTransform: "none",
  letterSpacing: "0.3px",
  transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
  flex: 1,
  "&:hover": {
    transform: "translateY(-2px)",
  },
}));

const PrimaryButton = styled(StyledButton)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  },
}));

const SecondaryButton = styled(StyledButton)(({ theme }) => ({
  backgroundColor: "transparent",
  color: theme.palette.text.secondary,
  border: `1px solid ${theme.palette.divider}`,
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
    borderColor: theme.palette.text.secondary,
  },
}));

const TertiaryButton = styled(StyledButton)(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
  color: theme.palette.text.primary,
  "&:hover": {
    backgroundColor: theme.palette.grey[200],
  },
}));

const CompleteButton = styled(StyledButton)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.light} 100%)`,
  color: theme.palette.common.white,
  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  position: "relative",
  overflow: "hidden",
  zIndex: 1,
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `linear-gradient(135deg, ${theme.palette.success.dark} 0%, ${theme.palette.success.main} 100%)`,
    opacity: 0,
    transition: "opacity 0.3s ease",
    zIndex: -1,
  },
  "&:hover": {
    transform: "translateY(-2px) scale(1.02)",
    boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
    "&::before": {
      opacity: 1,
    },
    "& .check-icon": {
      transform: "translateX(0) rotate(0deg)",
      opacity: 1,
    },
    "& .button-text": {
      transform: "translateX(6px)",
    },
  },
  "& .check-icon": {
    transition: "all 0.3s ease",
    transform: "translateX(-10px) rotate(-30deg)",
    opacity: 0,
    marginRight: theme.spacing(0.5),
  },
  "& .button-text": {
    transition: "transform 0.3s ease",
    display: "inline-block",
  },
}));

const YarnCard = ({
  title,
  description,
  date,
  onViewMore,
  onDelete,
  onDuplicate,
  onComplete,
  imageURL,
  status = "pending", // Default to pending if not provided
  onImageClick,
}) => {
  return (
    <StyledCard>
      <MediaWrapper onClick={onImageClick}>
        <StyledCardMedia
          className="card-media"
          component="img"
          image={
            (imageURL || "").trim() ||
            "https://images.unsplash.com/photo-1533050487297-09b450131914?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
          }
          alt="Yarn sample"
        />
        <StatusBadge label={status} status={status} size="small" />
        <CardActions className="card-actions">
          <ActionIconButton aria-label="add to favorites" size="small">
            <Favorite fontSize="small" />
          </ActionIconButton>
          <ActionIconButton aria-label="share" size="small">
            <Share fontSize="small" />
          </ActionIconButton>
          <ActionIconButton aria-label="more" size="small">
            <MoreVert fontSize="small" />
          </ActionIconButton>
        </CardActions>
      </MediaWrapper>

      <BottomContent>
        <TitleRow>
          <TitleText variant="subtitle1">{title}</TitleText>
          <DateText variant="caption">{date}</DateText>
        </TitleRow>
        <DescriptionText variant="body2">
          {description || "Premium quality yarn for all your crafting needs."}
        </DescriptionText>
        <ActionButtons>
          {onComplete && (
            <CompleteButton onClick={onComplete} variant="contained">
              <Check className="check-icon" fontSize="small" />
              <span className="button-text">Complete</span>
            </CompleteButton>
          )}
          {onViewMore && (
            <PrimaryButton onClick={onViewMore} variant="contained">
              View
            </PrimaryButton>
          )}

          {onDuplicate && (
            <TertiaryButton
              onClick={onDuplicate}
              startIcon={<ContentCopy fontSize="small" />}
            >
              Duplicate
            </TertiaryButton>
          )}
          {onDelete && (
            <SecondaryButton onClick={onDelete} variant="outlined">
              Delete
            </SecondaryButton>
          )}
        </ActionButtons>
      </BottomContent>
    </StyledCard>
  );
};

export default YarnCard;
