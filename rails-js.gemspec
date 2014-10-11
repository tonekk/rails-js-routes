Gem::Specification.new do |s|
  s.name          = 'rails-js'
  s.version       = '0.0.1'
  s.date          = '2014-10-11'
  s.summary       = "A new approach to structure your javascript in non single-page Rails apps"
  s.description   = "Divide your javascript like you divide your ruby code. Put it in controllers and actions and write clean, scalable code."
  s.authors       = ["Finn-Lenanrt Heemeyer"]
  s.email         = 'finn@heemeyer.net'
  s.files         = `git ls-files`.split("\n")
  s.require_paths = ['lib']
  s.homepage      = 'http://rubygems.org/gems/rails-js'
  s.license       = 'MIT'
end
