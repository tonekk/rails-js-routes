module Rails
  module JsRouteDispatch
    if defined?(::Rails)
      require_relative 'js/view_helpers'
      require_relative 'js/engine'
    end
  end
end
