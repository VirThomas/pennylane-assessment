# Pennylane-Assessment (a.k.a. Cook-eat)
## _The Smartest Recipe Search Engine_

**Live demo**: https://pennylane-recipes-kype.onrender.com

---

## Features 🚀

- Search recipes by ingredients (add/remove dynamically)
- Recipes sorted by number of missing ingredients
- Clear display: image, author, time, category, rating, missing ingredients
- Pagination, loading spinner, error handling
- Modern UI (Material UI, React)
- Database seeded with ~10,000 recipes scraped from marmiton.org

---

## Tech 💻

- **Backend**: Ruby on Rails (API only), PostgreSQL, PgSearch (tsearch + trigram)
- **Frontend**: ReactJS (Material UI)
- **Deployment**: Render

## Sources 📜

- **[ReactJs]**: <https://fr.react.dev>
- **[PgSearch]**: <https://github.com/Casecommons/pg_search>
- **[Postgresql]**: <https://www.postgresql.org>
- **[RubyOnRails]**: <https://rubyonrails.org/>
- **[MaterialUI]**: <https://mui.com>
- **[Render]**: <https://render.com>

---

## Installation & Startup 🔨

### 1. Rails Backend

```sh
cd pennylane
bundle install
rails db:create && rails db:migrate
rake seed_db:run   # Seed the database with recipes from recipes-en.json
rails s            # Start the server on port 3002
```

### 2. React Frontend

```sh
cd pennylane-front
npm install
echo "REACT_APP_ENDPOINT_URL=http://localhost:3002/api/v1/search" > .env
npm start          # Start the frontend on port 3000
```

---

## Usage

- Add your ingredients one by one in the search bar, validate with "Enter" or the "Add" button.
- Remove an ingredient by clicking the cross on its chip.
- The search is triggered automatically whenever the ingredient list changes.
- Recipes are sorted: those you can make with your ingredients come first, then those with the fewest missing ingredients.
- Click a recipe card to expand and see the full ingredient list.

---

## API

- **Endpoint**: `/api/v1/search?ingredients=ingredient1,ingredient2,...`
- **Method**: `GET`
- **Response**: JSON, list of recipes sorted by missing ingredients count. Each recipe includes an array of ingredients, and a ingredients_tsvector which is tokenized and normalized version of the array, which help us for an optimized full-text search  

Example request:
```
GET http://localhost:3002/api/v1/search?ingredients=salt,avocado
```

---

## Database Structure

Table `recipes`:
- `title` (string)
- `ratings` (float)
- `prep_time` (string)
- `cook_time` (string)
- `ingredients` (array of text)
- `author` (string)
- `image` (string)
- `cuisine` (string)
- `category` (string)
- `ingredients_tsvector` (tsvector, for full-text search)

---

## Seeding

The database is populated via the rake task:
```sh
rake seed_db:run
```
This reads the `recipes-en.json` file, create recipes, and generates the full-text index.

---

## How Search Works (Backend)

```ruby
class Recipe < ApplicationRecord
  include PgSearch::Model
  pg_search_scope(
    :search,
    against: :ingredients_tsvector,
    using: {
      tsearch: { any_word: true, prefix: true },
      trigram: { threshold: 0.1 }
    }
  )
end
```
- **tsearch**: Full-text search, tolerant to plurals/singulars, partial words
- **trigram**: Tolerant to typos
- **Sorting**: By number of missing ingredients (computed server-side)

---

## Frontend UX (React)

- Ingredient input, dynamic add/remove
- Automatic API call on every change
- Recipes displayed as cards: image, title, author, rating, time, category, missing ingredients
- Pagination
- Expandable card for full ingredient list

---

## TODO / Next Steps 📡

- User authentication and favorites/bookmarks
- Advanced filters (cuisine, time, etc.)
- Improved search logic (ingredient quantity, exclusions, etc.)

---

**Bon appétit! 🍳**
