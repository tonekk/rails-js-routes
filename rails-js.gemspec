$:.push File.expand_path("../lib", __FILE__)

# Maintain your gem's version:
require "rails/js/version"

Gem::Specification.new do |s|
  s.name          = 'rails-js'
  s.version       = Rails::JS::VERSION
  s.date          = '2014-10-11'
  s.summary       = "A new approach to structure your javascript in non single-page Rails apps"
  s.description   = "Divide your javascript like you divide your ruby code. Put it in controllers and actions and write clean, scalable code."
  s.authors       = ["Finn-Lenanrt Heemeyer"]
  s.email         = 'finn@heemeyer.net'
  s.files         = `git ls-files`.split("\n")
  s.require_paths = ['lib']
  s.homepage      = 'http://rubygems.org/gems/rails-js'
  s.license       = 'MIT'

  s.add_dependency "rails", "~> 4.1"
  s.add_development_dependency "sqlite3", "~> 1.3"
  s.add_development_dependency "teaspoon", "~> 0.8"
  s.add_development_dependency "poltergeist", "~> 1.5"
  s.add_development_dependency "coveralls", "~> 0.7"
end
