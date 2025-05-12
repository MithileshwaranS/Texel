import React from 'react';
import { Card, CardMedia, CardContent, Typography, Button, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 300,
  minWidth: 200,
  margin: '0.5rem',
  borderRadius: '8px',
  overflow: 'hidden',
  boxShadow: 'none',
  transition: 'all 0.3s ease',
  position: 'relative',
  backgroundColor: 'transparent',
  display: 'flex',
  flexDirection: 'column',
  '&:hover': {
    transform: 'scale(1.05)',
    zIndex: 10,
    '& .card-content': {
      opacity: 1,
      transform: 'translateY(0)',
    },
    '& .card-media': {
      transform: 'scale(1.1)',
    },
  },
}));

const MediaWrapper = styled(Box)({
  overflow: 'hidden',
  position: 'relative',
  height: '250px',
  borderRadius: '8px 8px 0 0',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 50%)',
    zIndex: 1,
  }
});

const StyledCardMedia = styled(CardMedia)({
  transition: 'transform 0.5s ease',
  height: '100%',
  width: '100%',
  objectFit: 'cover',
});

const ContentWrapper = styled(CardContent)(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: 2,
  padding: theme.spacing(2),
  opacity: 0,
  transform: 'translateY(20px)',
  transition: 'all 0.3s ease',
  background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%)',
  color: theme.palette.common.white,
}));

const BottomContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  borderRadius: '0 0 8px 8px',
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
}));

const TitleRow = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  marginBottom: '8px',
});

const TitleText = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  fontSize: '1rem',
  color: theme.palette.text.primary,
  flex: 1,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  marginRight: theme.spacing(1),
}));

const DateText = styled(Typography)(({ theme }) => ({
  fontSize: '0.85rem',
  color: theme.palette.text.secondary,
  whiteSpace: 'nowrap',
}));

const DescriptionText = styled(Typography)(({ theme }) => ({
  fontSize: '0.9rem',
  color: theme.palette.text.secondary,
  lineHeight: 1.4,
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  marginBottom: theme.spacing(2),
}));

const ActionButtons = styled(Box)({
  display: 'flex',
  gap: '8px',
  marginTop: 'auto', // Pushes buttons to bottom
});

const StyledButton = styled(Button)(({ theme }) => ({
  minWidth: 'unset',
  padding: '6px 12px',
  borderRadius: '4px',
  fontWeight: '600',
  fontSize: '0.8rem',
  textTransform: 'none',
  transition: 'all 0.2s ease',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

const PrimaryButton = styled(StyledButton)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));

const SecondaryButton = styled(StyledButton)(({ theme }) => ({
  backgroundColor: 'transparent',
  color: theme.palette.text.primary,
  border: `1px solid ${theme.palette.divider}`,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const YarnCard = ({ title, description, date, onViewMore, onDelete }) => {
  return (
    <StyledCard>
      <MediaWrapper>
        <StyledCardMedia
          className="card-media"
          component="img"
          image="https://images.unsplash.com/photo-1533050487297-09b450131914?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
          alt="Yarn sample"
        />
        <ContentWrapper className="card-content">
        </ContentWrapper>
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
          <PrimaryButton 
            onClick={onViewMore}
            variant="contained"
          >
            View
          </PrimaryButton>
          <SecondaryButton 
            onClick={onDelete}
            variant="outlined"
          >
            Delete
          </SecondaryButton>
        </ActionButtons>
      </BottomContent>
    </StyledCard>
  );
};

export default YarnCard;