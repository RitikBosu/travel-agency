pipeline {
    agent any
    
    tools {
        nodejs 'NodeJS'
    }
    
    environment {
        ENV_FILE = credentials('travel-agency-env')
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out code from repository...'
                checkout scm
            }
        }
        
        stage('Environment Setup') {
            steps {
                echo 'Setting up environment variables...'
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
                echo 'Building React Router application...'
                bat 'npm run build'
            }
        }
    }
    
    post {
        success {
            echo '✅ Build completed successfully!'
            echo '📦 Build artifacts are ready'
            echo 'ℹ️  Your app is still running on http://localhost:5173'
        }
        failure {
            echo '❌ Build failed! Check the logs above.'
        }
        always {
            echo 'Pipeline execution completed'
        }
    }
}
