class CreateRecipes < ActiveRecord::Migration[7.1]
  def up
    create_table :recipes do |t|
      t.string :title
      t.float :ratings
      t.string :prep_time
      t.text :ingredients, array: true, default: []
      t.string :author
      t.string :cook_time
      t.string :image
      t.string :cuisine
      t.string :category
      t.tsvector :ingredients_tsvector

      t.timestamps
    end

    add_index :recipes, :ingredients_tsvector, using: 'gin'

    # Create a trigger to automatically update the tsvector
    execute <<-SQL
      CREATE OR REPLACE FUNCTION recipes_ingredients_tsvector_trigger() RETURNS trigger AS $$
      begin
        new.ingredients_tsvector := to_tsvector('english', array_to_string(new.ingredients, ' '));
        return new;
      end
      $$ LANGUAGE plpgsql;

      CREATE TRIGGER recipes_ingredients_tsvector_update
      BEFORE INSERT OR UPDATE ON recipes
      FOR EACH ROW
      EXECUTE FUNCTION recipes_ingredients_tsvector_trigger();
    SQL
  end

  def down
    execute 'DROP TRIGGER IF EXISTS recipes_ingredients_tsvector_update ON recipes;'
    execute 'DROP FUNCTION IF EXISTS recipes_ingredients_tsvector_trigger();'
    drop_table :recipes
  end
end
