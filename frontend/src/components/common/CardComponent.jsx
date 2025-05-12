import React from 'react';
import { Card, CardMedia, CardContent, Typography, Button, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 345,
  margin: '1rem',
  borderRadius: '16px',
  overflow: 'hidden',
  boxShadow: theme.shadows[2],
  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  position: 'relative',
  backgroundColor: theme.palette.background.paper,
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[8],
    '& .card-media': {
      transform: 'scale(1.05)',
    },
    '&::after': {
      opacity: 0.15,
    }
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.secondary.light} 100%)`,
    opacity: 0,
    transition: 'opacity 0.4s ease',
    zIndex: 1,
  }
}));

const MediaWrapper = styled(Box)({
  overflow: 'hidden',
  position: 'relative',
  height: '200px',
});

const StyledCardMedia = styled(CardMedia)({
  transition: 'transform 0.5s ease',
  height: '100%',
  width: '100%',
  objectFit: 'cover',
});

const ContentWrapper = styled(CardContent)(({ theme }) => ({
  position: 'relative',
  zIndex: 2,
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
}));

const TitleText = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  marginBottom: theme.spacing(2),
  color: theme.palette.text.primary,
  letterSpacing: '0.5px',
}));

const DescriptionText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(3),
  lineHeight: 1.6,
}));

const StyledButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5, 4),
  borderRadius: '50px',
  fontWeight: '600',
  letterSpacing: '0.5px',
  textTransform: 'none',
  transition: 'all 0.3s ease',
  boxShadow: 'none',
  alignSelf: 'center',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[2],
  }
}));

const YarnCard = ({ title, description, onViewMore }) => {
  return (
    <StyledCard>
      <MediaWrapper>
        <StyledCardMedia
          className="card-media"
          component="img"
          image="https://images.unsplash.com/photo-1533050487297-09b450131914?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
          alt="Yarn sample"
        />
      </MediaWrapper>
      <ContentWrapper>
        <TitleText variant="h5" component="h3">
          {title}
        </TitleText>
        <DescriptionText variant="body1">
          {description || "Premium quality yarn for all your crafting needs. Soft texture with vibrant colors."}
        </DescriptionText>
        <StyledButton 
          onClick={onViewMore} 
          variant="contained" 
          color="primary"
          disableElevation
        >
          View Details
        </StyledButton>
      </ContentWrapper>
    </StyledCard>
  );
};

export default YarnCard;