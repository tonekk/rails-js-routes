# Set RAILS_ROOT and load the environment if it's not already loaded.
# unless defined?(Rails)
#   ENV["RAILS_ROOT"] = File.expand_path("../../", __FILE__)
#   require File.expand_path("../../config/environment", __FILE__)
# end

Teaspoon.configure do |config|

  config.mount_at = "/tests"
  config.asset_paths = ["test/javascripts", "test/javascripts/stylesheets"]
  config.fixture_paths = ["test/fixtures/javascripts"]

  # Default suite
  config.suite do |suite|
    suite.use_framework :jasmine, "1.3.1"
    suite.matcher = "{test/javascripts}/**/*test.{js}"
    suite.helper = "test_helper"
  end

  # Server
  config.driver = "phantomjs"
  config.server_port = 31337
  config.color = true
end
