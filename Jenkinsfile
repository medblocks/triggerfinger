pipeline {
  agent any
  stages {
    stage('display') {
      steps {
        sh 'cat docker-compose.yml'
      }
    }
    stage('prepare') {
      steps {
        sh 'mkdir output && chown -R $USER output'
      }
    }
    stage('test') {
      steps {
        sh 'docker-compose run --rm cypress'
      }
    }
  }
  post {
    always {
      sh 'docker-compose down'
    }
  }
}