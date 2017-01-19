require 'test_helper'

class QuizTest < ActiveSupport::TestCase

  def setup
    @user = User.create(name: 'Pedro', email: 'pedro@example.com', experience: 'Boa experiência', age: '25 a 29')
    @quiz = Quiz.new(question_1: 'A', question_2: 'A', question_3: 'A', question_4: 'A', 
                     question_5: 'A', question_6: 'A', question_7: 'A', question_8: 'A', 
                     user: @user)
  end

  # Valid assertion

  test 'quiz should be valid' do
    assert @quiz.valid?
  end

  # Invalid presence assertions

  test 'quiz question_1 should be present' do
    @quiz.question_1 = nil
    assert_not @quiz.valid?
  end

  test 'quiz question_8 should be present' do
    @quiz.question_8 = nil
    assert_not @quiz.valid?
  end

  test 'quiz user should be present' do
    @quiz.user = nil
    assert_not @quiz.valid?
  end

  # Invalid length assertions
  
  test 'quiz question_1 should have 1 character' do
    @quiz.question_1 = 'aa'
    assert_not @quiz.valid?
  end

  test 'quiz question_8 should have 1 character' do
    @quiz.question_8 = 'aaa'
    assert_not @quiz.valid?
  end

end
