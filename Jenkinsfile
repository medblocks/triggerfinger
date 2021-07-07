pipeline {
  agent any
  stages {
    stage('error') {
      steps {
        sh 'docker-compose run --rm cypress'
      }
    }
  }
}