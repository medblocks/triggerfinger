pipeline {
  agent any
  stages {
    stage('display') {
      steps {
        sh 'cat docker-compose.yml'
      }
    }

    stage('test') {
      steps {
        sh 'docker-compose run --rm cypress'
      }
    }

  }
}