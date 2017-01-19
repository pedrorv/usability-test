class QuizControllerTest < ActionController::TestCase

  def setup
    @user = User.new(name: 'Pedro', email: 'pedro@example.com', experience: 'Boa experiência', age: '25 a 29')
    @quiz = Quiz.new(question_1: 'A', question_2: 'A', question_3: 'A', question_4: 'A', 
                     question_5: 'A', question_6: 'A', question_7: 'A', question_8: 'A', 
                     user: @user)
  end

  # Valid request

  test 'should post send_quiz with all valid parameters' do
    post :send_quiz, name: @user.name, email: @user.email, experience: @user.experience, age: @user.age,
                     question_1: @quiz.question_1, question_2: @quiz.question_2, question_3: @quiz.question_3,
                     question_4: @quiz.question_4, question_5: @quiz.question_5, question_6: @quiz.question_6,
                     question_7: @quiz.question_7, question_8: @quiz.question_8
    
    @response_object = JSON.parse(@response.body)
    assert_response :success
    assert_equal false, @response_object["errors"]
  end

end