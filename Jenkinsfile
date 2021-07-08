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
        sh 'docker-compose run -u jenkins --rm cypress && docker-compose down'
      }
    }

  }
}