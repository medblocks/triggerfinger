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
        sh 'docker-compose run -e DOCKER_USER_ID=$(id -u):$(id -g) --rm cypress'
      }
    }
    stage('publish') {
      steps {
        publishHTML (target: [
          allowMissing: false,
          alwaysLinkToLastBuild: false,
          keepAll: true,
          reportDir: 'output',
          reportFiles: 'index.html',
          reportName: "Template Report"
        ])
      }
    }
  }
  post {
    always {
      sh 'docker-compose down'
    }
  }
}