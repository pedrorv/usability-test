require 'test_helper'

class UserTest < ActiveSupport::TestCase

  def setup
    @user = User.new(name: 'Pedro', email: 'pedro@example.com', experience: 'Boa experiência', age: '25 a 29')
  end

  # Valid assertion

  test 'user should be valid' do
    assert @user.valid?
  end

  # Invalid presence assertions

  test 'user name should be present' do
    @user.name = nil
    assert_not @user.valid?
  end

  test 'user email should be present' do
    @user.email = nil
    assert_not @user.valid?
  end

  test 'user experience should be present' do
    @user.experience = nil
    assert_not @user.valid?
  end

  test 'user age should be present' do
    @user.age = nil
    assert_not @user.valid?
  end

  # Invalid length assertions

  test 'user name should be between 3 and 50 characters' do
    @user.name = 'a' * 2
    assert_not @user.valid?

    @user.name = 'a' * 51
    assert_not @user.valid?
  end

  test 'user email should have a maximum of 320 characters' do
    @user.email = 'a' * 64 + '@' + 'a' * 252 + '.com'
    assert_not @user.valid?
  end

  # Invalid format assertions

  test 'user email should have a valid format' do
    @user.email = 'a'
    assert_not @user.valid?

    @user.email = 'aaaaa@aaaaa'
    assert_not @user.valid?

    @user.email = '@example.com'
    assert_not @user.valid?
  end

end
