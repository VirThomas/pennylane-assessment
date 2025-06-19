namespace :seed_db do
  desc 'seed db with recipes-en.json'
  task run: :environment do
    json_data = File.read('recipes-en.json')
    recipes = JSON.parse(json_data)

    Recipe.import recipes
    Recipe.update_all("ingredients_tsvector = to_tsvector('english', array_to_string(ingredients, ' '))")
  end
end
