module Api
  module V1
    class SearchController < ApplicationController
      before_action :permit_params

      def index
        search_terms = params[:ingredients].split(',').map(&:strip).map(&:downcase)
        query = params[:ingredients]

        @recipes = Recipe.search(query)

        sorted_recipes = @recipes.sort_by { |recipe| recipe.missing_ingredients_count(search_terms) }

        render json: sorted_recipes.map { |recipe|
          recipe.as_json.merge(missing_ingredients_count: recipe.missing_ingredients_count(search_terms))
        }
      end

      private

      def permit_params
        ActionController::Parameters.permit_all_parameters = true
      end
    end
  end
end
