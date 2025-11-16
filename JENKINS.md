# Jenkins CI/CD Pipeline Setup

## 🚀 Quick Setup Guide

### Prerequisites
1. Jenkins installed and running
2. Docker installed on Jenkins server
3. Jenkins plugins required:
   - Docker Pipeline
   - Git plugin
   - Pipeline plugin

### Step 1: Configure Jenkins

#### Install Required Plugins
1. Go to Jenkins → Manage Jenkins → Manage Plugins
2. Install these plugins:
   - **Docker Pipeline**
   - **Git Plugin**
   - **Pipeline**

#### Configure Docker in Jenkins
1. Go to Manage Jenkins → Global Tool Configuration
2. Add Docker installation
3. Make sure Jenkins user has Docker permissions:
   ```bash
   sudo usermod -aG docker jenkins
   sudo systemctl restart jenkins
   ```

### Step 2: Add Environment Variables

#### Option A: Using Jenkins Credentials
1. Go to Jenkins → Manage Jenkins → Manage Credentials
2. Add a "Secret file" credential
3. Upload your `.env.local` file
4. Note the credential ID

#### Option B: Copy .env.local to Jenkins Workspace
```bash
# Copy .env.local to Jenkins workspace before running pipeline
cp .env.local /var/lib/jenkins/workspace/travel-agency/
```

### Step 3: Create Jenkins Pipeline Job

1. **New Item** → Enter name: `travel-agency-pipeline`
2. Select **Pipeline** → Click OK
3. Under **Pipeline** section:
   - Definition: **Pipeline script from SCM**
   - SCM: **Git**
   - Repository URL: `https://github.com/RitikBosu/travel-agency`
   - Branch: `*/main`
   - Script Path: `Jenkinsfile`
4. Click **Save**

### Step 4: Run the Pipeline

Click **Build Now** to start the pipeline!

---

## 📋 Pipeline Stages

The pipeline includes these stages:

1. **Checkout** - Clone the repository
2. **Environment Setup** - Verify .env.local exists
3. **Build Docker Image** - Build the Docker image
4. **Stop Old Container** - Stop and remove old container
5. **Run Container** - Start new container
6. **Health Check** - Verify app is running
7. **Cleanup** - Remove unused Docker images

---

## 🔧 Customization

### Change Port
Edit `Jenkinsfile` line:
```groovy
PORT = '5173'  // Change to your desired port
```

### Change Container Name
Edit `Jenkinsfile` line:
```groovy
CONTAINER_NAME = 'travel-agency-app'  // Change name
```

### Add Build Triggers

In Jenkins job configuration, add:
- **GitHub webhook** for auto-build on push
- **Poll SCM** schedule: `H/5 * * * *` (every 5 minutes)

---

## 🔐 Security Best Practices

### Use Jenkins Credentials for Secrets

Update Jenkinsfile to use credentials:
```groovy
environment {
    ENV_FILE = credentials('env-local-file-id')
}

stage('Run Container') {
    steps {
        script {
            sh """
                docker run -d \
                    --name ${CONTAINER_NAME} \
                    -p ${PORT}:3000 \
                    --env-file ${ENV_FILE} \
                    ${DOCKER_IMAGE}:${DOCKER_TAG}
            """
        }
    }
}
```

---

## 📊 Monitoring

### View Logs
```bash
# View container logs
docker logs travel-agency-app

# Follow logs in real-time
docker logs -f travel-agency-app
```

### Check Container Status
```bash
docker ps -a | grep travel-agency
```

---

## 🐛 Troubleshooting

### Jenkins can't access Docker
```bash
sudo usermod -aG docker jenkins
sudo systemctl restart jenkins
```

### Port already in use
```bash
# Find process using port 5173
lsof -i :5173

# Kill the process
kill -9 <PID>
```

### Container won't start
```bash
# Check logs
docker logs travel-agency-app

# Check if .env.local is present
docker exec travel-agency-app ls -la .env.local
```

---

## 🔄 Manual Commands

### Build manually
```bash
docker build -t travel-agency:manual .
```

### Run manually
```bash
docker run -d \
    --name travel-agency-manual \
    -p 5173:3000 \
    --env-file .env.local \
    travel-agency:manual
```

### Stop and remove
```bash
docker stop travel-agency-manual
docker rm travel-agency-manual
```

---

## 📚 Additional Resources

- [Jenkins Pipeline Documentation](https://www.jenkins.io/doc/book/pipeline/)
- [Docker Pipeline Plugin](https://plugins.jenkins.io/docker-workflow/)
- [GitHub Webhook Setup](https://docs.github.com/en/webhooks)
