class AddPgTrgmExtension < ActiveRecord::Migration[7.1]
  def up
    enable_extension 'plpgsql'
    execute 'CREATE EXTENSION IF NOT EXISTS pg_trgm'
  end

  def down
    execute 'DROP EXTENSION IF EXISTS pg_trgm'
  end
end
