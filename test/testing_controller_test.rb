require 'test_helper'

class TestingControllerTest < ActionController::TestCase

  # Tests if the view_helper 'rails_js' is working
  # Tests if the file 'rails.js' gets included via sprockets
  test "get #index" do
    get :index

    assert_response :success
  end
end
