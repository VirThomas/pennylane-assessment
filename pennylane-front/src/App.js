import './App.css';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import RecipeReviewCard from './components/RecipeReviewCard';
import {
  Container,
  TextField,
  Button,
  Grid,
  Box,
  Typography,
  Pagination,
  CircularProgress,
  Alert,
  Chip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pageKey, setPageKey] = useState(0);
  const prevIngredientsRef = useRef([]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleAddIngredient = () => {
    if (searchTerm.trim() && !ingredients.includes(searchTerm.trim())) {
      setIngredients([...ingredients, searchTerm.trim()]);
      setSearchTerm('');
    }
  };

  const handleRemoveIngredient = (ingredientToRemove) => {
    setIngredients(ingredients.filter(ingredient => ingredient !== ingredientToRemove));
  };

  const handleSubmit = async () => {
    if (ingredients.length === 0) {
      setRecipes([]);
      setCurrentPage(1);
      setPageKey(0);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('URL', process.env.REACT_APP_ENDPOINT_URL);
      console.log('ingredients', ingredients);

      const response = await axios.get(process.env.REACT_APP_ENDPOINT_URL, {
        params: { ingredients: ingredients.join(',') }
      });
      setRecipes(response.data);
      setCurrentPage(1);
      setPageKey(0);
    } catch (error) {
      setError('Une erreur est survenue lors de la recherche. Veuillez réessayer.');
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleAddIngredient();
    }
  };

  const handlePageChange = (_, value) => {
    setCurrentPage(value);
    setPageKey(prev => prev + 1);
  };

  useEffect(() => {
    handleSubmit();

  }, [ingredients]);

  const recipesPerPage = 9;
  const totalPages = Math.ceil(recipes.length / recipesPerPage);
  const startIndex = (currentPage - 1) * recipesPerPage;
  const displayedRecipes = recipes.slice(startIndex, startIndex + recipesPerPage);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Trouvez vos recettes
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Ajoutez vos ingrédients pour découvrir des recettes
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 2, justifyContent: 'center' }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Ajouter un ingrédient..."
          value={searchTerm}
          onChange={handleSearch}
          onKeyPress={handleKeyPress}
          sx={{ maxWidth: 600 }}
        />
        <Button
          variant="outlined"
          onClick={handleAddIngredient}
          startIcon={<AddIcon />}
        >
          Ajouter
        </Button>
      </Box>

      <Box sx={{ display: 'flex', gap: 1, mb: 4, flexWrap: 'wrap', justifyContent: 'center' }}>
        {ingredients.map((ingredient, index) => (
          <Chip
            key={index}
            label={ingredient}
            onDelete={() => handleRemoveIngredient(ingredient)}
            color="primary"
            variant="outlined"
          />
        ))}
      </Box>

      {ingredients.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <Button
            variant="contained"
            size="large"
            onClick={handleSubmit}
            startIcon={<SearchIcon />}
            disabled={loading}
          >
            Trouver des recettes
          </Button>
        </Box>
      )}

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {recipes.length > 0 && !loading && (
        <>
          <Grid container spacing={3}>
            {displayedRecipes.map((recipe, index) => (
              <Grid item xs={12} sm={6} md={4} key={`${pageKey}-${recipe.title}-${index}`}>
                <RecipeReviewCard recipe={recipe} userIngredients={ingredients} />
              </Grid>
            ))}
          </Grid>

          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </>
      )}

      {recipes.length === 0 && !loading && !error && ingredients.length > 0 && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h6" color="text.secondary">
            Aucune recette trouvée pour ces ingrédients
          </Typography>
        </Box>
      )}
    </Container>
  );
}

export default App;
