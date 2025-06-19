import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Collapse,
  Box,
  Chip,
  Rating,
  CardActions,
  CardHeader,
  Avatar
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { styled } from '@mui/material/styles';

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

const defaultImage = 'https://assets.afcdn.com/recipe/20100101/recipe_default_img_placeholder_w500h500c1.jpg';

export default function RecipeReviewCard({ recipe, userIngredients = [] }) {
  const [expanded, setExpanded] = useState(false);
  const [imgSrc, setImgSrc] = useState(recipe.image || defaultImage);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const formatTime = (time) => {
    if (!time) return 'N/A';
    return typeof time === 'number' ? `${time} min` : time;
  };

  const handleImageError = () => {
    setImgSrc(defaultImage);
  };

  const missingIngredients = recipe.ingredients.filter(ingredient =>
    !userIngredients.some(userIng =>
      ingredient.toLowerCase().includes(userIng.toLowerCase())
    )
  );
  const missingCount = missingIngredients.length;

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: 'primary.main' }}>
            <RestaurantIcon />
          </Avatar>
        }
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <span>{recipe.title}</span>
            {missingCount > 0 && (
              <Chip
                label={`${missingCount}`}
                color="warning"
                size="small"
                sx={{ fontWeight: 700 }}
              />
            )}
          </Box>
        }
        subheader={`Par ${recipe.author}`}
      />
      <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%' }}>
        <img
          src={imgSrc}
          alt={recipe.title}
          onError={handleImageError}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
      </div>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Rating value={recipe.ratings} precision={0.1} readOnly />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
            ({recipe.ratings})
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <AccessTimeIcon sx={{ mr: 0.5, fontSize: '1rem' }} />
            <Typography variant="body2" color="text.secondary">
              {formatTime(recipe.prep_time)} prép
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <AccessTimeIcon sx={{ mr: 0.5, fontSize: '1rem' }} />
            <Typography variant="body2" color="text.secondary">
              {formatTime(recipe.cook_time)} cuisson
            </Typography>
          </Box>
        </Box>
        {recipe.category && (
          <Chip
            label={recipe.category}
            size="small"
            color="primary"
            variant="outlined"
            sx={{ mt: 1 }}
          />
        )}
        {missingCount > 0 && (
          <Box sx={{ mt: 2, mb: 1 }}>
            <Chip
              icon={<ErrorOutlineIcon />}
              label={
                <span>
                  <b>{missingCount} ingrédient{missingCount > 1 ? 's' : ''} manquant{missingCount > 1 ? 's' : ''}</b>
                </span>
              }
              color="warning"
              variant="filled"
              sx={{ fontWeight: 600, fontSize: '1rem', mt: 1 }}
            />
          </Box>
        )}
        {missingCount === 0 && (
          <Box sx={{ mt: 2, mb: 1 }}>
            <Chip
              label={<b>Recette réalisable</b>}
              color="success"
              variant="filled"
              sx={{ fontWeight: 600, fontSize: '1rem', mt: 1 }}
            />
          </Box>
        )}
      </CardContent>
      <CardActions disableSpacing>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Ingrédients
          </Typography>
          <Box component="ul" sx={{ pl: 2, m: 0 }}>
            {recipe.ingredients.map((ingredient, index) => {
              const isMissing = missingIngredients.includes(ingredient);
              return (
                <Typography
                  component="li"
                  key={index}
                  variant="body2"
                  paragraph
                  sx={{
                    backgroundColor: isMissing ? 'rgba(255, 152, 0, 0.1)' : 'transparent',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    color: isMissing ? 'warning.main' : 'inherit'
                  }}
                >
                  {ingredient}
                </Typography>
              );
            })}
          </Box>
        </CardContent>
      </Collapse>
    </Card>
  );
}