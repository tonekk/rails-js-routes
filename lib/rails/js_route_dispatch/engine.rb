module Rails
  module JsRouteDispatch
    class Engine < ::Rails::Engine
      initializer "rails-js_route_dispatch.view_helpers" do |app|
        # include view helpers
        ActionView::Base.send :include, ViewHelpers
      end
    end
  end
end
