class Quiz < ActiveRecord::Base
    belongs_to :user

    validates :question_1, :question_2, :question_3, :question_4,
              :question_5, :question_6, :question_7, :question_8, 
              presence: true, length: { is: 1 }
              
    validates_presence_of :user
end
