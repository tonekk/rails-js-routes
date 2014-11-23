module Rails
  module JsRouteDispatch
    if defined?(::Rails)
      require_relative 'js_route_dispatch/view_helpers'
      require_relative 'js_route_dispatch/engine'
    end
  end
end
