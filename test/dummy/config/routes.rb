Rails.application.routes.draw do

  resources :testing, only: [:index]
end
