pipeline {
  agent any
  stages {
    stage('test') {
      steps {
        sh 'docker-compose run --rm cypress'
      }
    }
  }
}