begin
  require 'bundler/setup'
rescue LoadError
  puts 'You must `gem install bundler` and `bundle install` to run rake tasks'
end

Bundler::GemHelper.install_tasks

require 'rake/testtask'

Rake::TestTask.new(:test) do |t|
  t.libs << 'lib'
  t.libs << 'test'
  t.pattern = 'test/**/*_test.rb'
  t.verbose = false
end

# teaspoon must be executed inside the dummy rails app
task :teaspoon do
  Dir.chdir('test/dummy/')
  sh 'bundle exec rake teaspoon'
end

# add teaspoon to default tasks
task default: :test
