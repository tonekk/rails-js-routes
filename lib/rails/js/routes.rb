module Rails
  module JS
    module Routes
      if defined?(::Rails)
        require_relative 'routes/view_helpers'
        require_relative 'routes/engine'
      end
    end
  end
end
