class Recipe < ApplicationRecord
  include PgSearch::Model

  before_save :decode_image_url

  pg_search_scope(
    :search,
    against: :ingredients_tsvector,
    using: {
      tsearch: {
        any_word: true,
        prefix: true
      },
      trigram: {
        threshold: 0.1
      }
    }
  )

  def self.import(recipes_data)
    recipes_data.each do |recipe_data|
      create!(
        title: recipe_data['title'],
        cook_time: recipe_data['cook_time'],
        prep_time: recipe_data['prep_time'],
        ingredients: recipe_data['ingredients'],
        ratings: recipe_data['ratings'],
        cuisine: recipe_data['cuisine'],
        category: recipe_data['category'],
        author: recipe_data['author'],
        image: recipe_data['image']
      )
    end
  end

  def as_json(_options = {})
    {
      title:,
      cook_time:,
      prep_time:,
      ingredients:,
      ratings:,
      cuisine:,
      category:,
      author:,
      image:
    }
  end

  def missing_ingredients_count(user_ingredients)
    return ingredients.length if user_ingredients.blank?

    user_ingredients_down = user_ingredients.map(&:downcase)
    ingredients.select do |ingredient|
      user_ingredients_down.none? { |user_ing| ingredient.downcase.include?(user_ing) }
    end.length
  end

  private

  def decode_image_url
    return unless image.present?

    self.image = URI.decode_www_form_component(image.gsub('https://imagesvc.meredithcorp.io/v3/mm/image?url=', ''))
  end
end
