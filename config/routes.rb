Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get 'up' => 'rails/health#show', as: :rails_health_check
  namespace :api do
    namespace :v1 do
      resources :search, only: [:index]
    end
  end
  get '*path', to: 'home#index', constraints: lambda { |req|
    !req.xhr? && req.format.html? && !req.path.starts_with?('/api')
  }

  # Defines the root path route ("/")
  # root "posts#index"
end
