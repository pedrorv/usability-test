Rails.application.routes.draw do
  root 'application#angular'

  post 'send_quiz', to: 'quiz#send_quiz'
end
