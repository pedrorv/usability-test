class User < ActiveRecord::Base
    has_one :quiz

    validates :name, :email, :age, :experience, presence: true
    validates :name, length: { minimum: 3, maximum: 50 }
    validates :email, :with => /\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\z/i
    
end
