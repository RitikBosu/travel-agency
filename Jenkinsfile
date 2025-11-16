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
                    bat "copy \"%ENV_FILE%\" .env.local"
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
                    bat """
                        docker stop ${CONTAINER_NAME} || exit 0
                        docker rm ${CONTAINER_NAME} || exit 0
                    """
                }
            }
        }
        
        stage('Run Container') {
            steps {
                echo 'Starting new container...'
                script {
                    bat """
                        docker run -d ^
                            --name ${CONTAINER_NAME} ^
                            -p ${PORT}:3000 ^
                            --env-file .env.local ^
                            --restart unless-stopped ^
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
                    bat """
                        curl -f http://localhost:${PORT} || exit 1
                    """
                }
            }
        }
        
        stage('Cleanup Old Images') {
            steps {
                echo 'Cleaning up old Docker images...'
                script {
                    bat "docker image prune -f"
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
                bat "docker logs ${CONTAINER_NAME} || exit 0"
            }
        }
        always {
            echo 'Cleaning up workspace...'
            cleanWs()
        }
    }
}
