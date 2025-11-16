pipeline {
    agent any
    
    environment {
        ENV_FILE = credentials('travel-agency-env')
        PORT = '5173'
    }
    
    tools {
        nodejs 'NodeJS'  // Configure this in Jenkins Global Tool Configuration
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
                echo 'Setting up environment file...'
                script {
                    bat "copy \"%ENV_FILE%\" .env.local"
                }
            }
        }
        
        stage('Install Dependencies') {
            steps {
                echo 'Installing npm dependencies...'
                bat 'npm install'
            }
        }
        
        stage('Build Application') {
            steps {
                echo 'Building application...'
                bat 'npm run build'
            }
        }
        
        stage('Stop Old Process') {
            steps {
                echo 'Stopping any existing process on port 5173...'
                script {
                    bat """
                        for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5173') do taskkill /F /PID %%a || exit 0
                    """
                }
            }
        }
        
        stage('Start Application') {
            steps {
                echo 'Starting application...'
                script {
                    bat 'start /B npm run start'
                    sleep(time: 10, unit: 'SECONDS')
                }
            }
        }
        
        stage('Health Check') {
            steps {
                echo 'Checking if application is running...'
                script {
                    bat 'curl -f http://localhost:5173 || exit 1'
                }
            }
        }
    }
    
    post {
        success {
            echo '✅ Pipeline completed successfully!'
            echo 'Application is running at http://localhost:5173'
        }
        failure {
            echo '❌ Pipeline failed!'
        }
    }
}
