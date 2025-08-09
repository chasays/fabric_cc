pipeline {
    agent any
    
    environment {
        BASE_URL = 'https://parabank.parasoft.com'
        NODE_VERSION = '20.18.0'
        // add others
    }
    
    stages {
        stage('Checkout') {
            steps {
            //  trigger by crontab or git hook events
            }
        }
        
        stage('Setup Node.js') {
            steps {
                script {
                    def nodeHome = tool name: "Node-${NODE_VERSION}", type: 'nodejs'
                    env.PATH = "${nodeHome}/bin:${env.PATH}"
                }
            }
        }
        
        stage('Install Dependencies') {
            steps {
                sh 'npm install -g pnpm'
                sh 'pnpm ci'
                sh 'npx playwright install'
                // maybe add more
            }
        }
        
        stage('Lint and Format Check') {
            steps {
                sh 'pnpm run lint'
                sh 'npx prettier --check src tests'
            }
        }
        
        stage('Run Tests') {
            parallel {
                stage('UI Tests') {
                    steps {
                        sh 'pnpm run test:ui'
                    }
                    post {
                        always {
                            publishHTML([
                                allowMissing: false,
                                alwaysLinkToLastBuild: true,
                                keepAll: true,
                                reportDir: 'playwright-report',
                                reportFiles: 'index.html',
                                reportName: 'UI Test Report'
                            ])
                        }
                    }
                }
                
                stage('API Tests') {
                    steps {
                        sh 'pnpm run test:api'
                    }
                }
                
                stage('E2E Tests') {
                    steps {
                        sh 'pnpm run test:e2e'
                    }
                }
            }
        }
        {// this stage is for only debug, like manual re-trigger for only sending msg
        // it is very useful  ~~ i think you can like it
            stage('check files') {
                steps {
                    sh 'ls -la'
                }
            }
        }
        
        stage('Generate Reports') {
            steps {
                script {
                    allure([
                        includeProperties: false,
                        jdk: '',
                        properties: [],
                        reportBuildPolicy: 'ALWAYS',
                        results: [[path: 'allure-results']]
                    ])
                }
            }
        }
        
        stage('Archive Results') {
            steps {
                archiveArtifacts artifacts: 'reports/**/*', fingerprint: true
                publishTestResults testResultsPattern: 'reports/junit.xml'
            }
        }
    }
    
    post {
        always {
            cleanWs()
        }
        failure {
            emailext(
                subject: "Test Failed: ${env.JOB_NAME} - ${env.BUILD_NUMBER}",
                body: "The test execution failed. Please check the Jenkins console output.",
                to: "${env.CHANGE_AUTHOR_EMAIL}" // by git hook events
                // to: "rikxiao@gmail.com" // by crontab events
            )
        }
        success {
            emailext(
                subject: "Test Passed: ${env.JOB_NAME} - ${env.BUILD_NUMBER}",
                body: "All tests passed successfully!",
                to: "${env.CHANGE_AUTHOR_EMAIL}"
                // to: "rikxiao@gmail.com, other" // by crontab events
            )
        }
    }
} 