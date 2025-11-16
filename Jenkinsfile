pipeline {
    agent any
    
    environment {
        DOCKER_IMAGE = 'travel-agency'
        DOCKER_TAG = "${BUILD_NUMBER}"
        CONTAINER_NAME = 'travel-agency-app'
        PORT = '5173'
        ENV_FILE = credentials('travel-agency-env')
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out code...'
                checkout scm
            }
        }
        
        stage('Environment Setup') {
            steps {
                echo 'Copying environment file from credentials...'
                script {
                    sh 'cp $ENV_FILE .env.local'
                }
            }
        }
        
        stage('Build Docker Image') {
            steps {
                echo 'Building Docker image...'
                script {
                    docker.build("${DOCKER_IMAGE}:${DOCKER_TAG}")
                    docker.build("${DOCKER_IMAGE}:latest")
                }
            }
        }
        
        stage('Stop Old Container') {
            steps {
                echo 'Stopping old container if running...'
                script {
                    sh """
                        docker stop ${CONTAINER_NAME} || true
                        docker rm ${CONTAINER_NAME} || true
                    """
                }
            }
        }
        
        stage('Run Container') {
            steps {
                echo 'Starting new container...'
                script {
                    sh """
                        docker run -d \
                            --name ${CONTAINER_NAME} \
                            -p ${PORT}:3000 \
                            --env-file .env.local \
                            --restart unless-stopped \
                            ${DOCKER_IMAGE}:${DOCKER_TAG}
                    """
                }
            }
        }
        
        stage('Health Check') {
            steps {
                echo 'Checking if application is running...'
                script {
                    sleep(time: 10, unit: 'SECONDS')
                    sh """
                        curl -f http://localhost:${PORT} || exit 1
                    """
                }
            }
        }
        
        stage('Cleanup Old Images') {
            steps {
                echo 'Cleaning up old Docker images...'
                script {
                    sh """
                        docker image prune -f
                    """
                }
            }
        }
    }
    
    post {
        success {
            echo '✅ Pipeline completed successfully!'
            echo "Application is running at http://localhost:${PORT}"
        }
        failure {
            echo '❌ Pipeline failed!'
            script {
                sh "docker logs ${CONTAINER_NAME} || true"
            }
        }
        always {
            echo 'Cleaning up workspace...'
            cleanWs()
        }
    }
}
