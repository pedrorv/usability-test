class QuizController < ActionController::Base

    def send_quiz
        @user = User.new
        @user.name = params[:name]
        @user.email = params[:email]
        @user.experience = params[:experience]
        @user.age = params[:age]

        if @user.save
            @quiz = Quiz.new
            @quiz.question_1 = params[:question_1]
            @quiz.question_2 = params[:question_2]
            @quiz.question_3 = params[:question_3]
            @quiz.question_4 = params[:question_4]
            @quiz.question_5 = params[:question_5]
            @quiz.question_6 = params[:question_6]
            @quiz.question_7 = params[:question_7]
            @quiz.question_8 = params[:question_8]
            @quiz.user = @user

            if @quiz.save
                render :json => { :errors => false }
            else
                render :json => { :errors => @quiz.errors.full_messages }
            end
        else
            render :json => { :errors => @user.errors.full_messages }
        end
    end
end