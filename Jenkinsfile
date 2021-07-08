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
        sh '''mkdir output
chown -R $USER output
docker-compose run --rm cypress && docker-compose down'''
      }
    }

  }
}