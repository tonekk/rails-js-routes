module Rails
  module JS
    class Engine < ::Rails::Engine
      initializer "rails-js.view_helpers" do |app|
        # include view helpers
        ActionView::Base.send :include, ViewHelpers
      end
    end
  end
end
