module Rails
  module JS
    module Routes
      class Engine < ::Rails::Engine
        initializer "rails-js-routes.view_helpers" do |app|
          # include view helpers
          ActionView::Base.send :include, ViewHelpers
        end
      end
    end
  end
end
