# 🎯 Credit Target Calculator

> A user-friendly web app to plan and track your loan repayments effortlessly! 💰📅

## 🚀 Features
- ✅ Calculate the payoff date based on your current balance and monthly rate
- ✅ Determine the required monthly rate to reach your target payoff date
- 📊 Interactive and intuitive interface
- 🌐 Built with Node.js, Express, HTML, CSS, and JavaScript

## 🖥️ Getting Started
Follow these steps to run the app locally:

### Prerequisites
- Node.js (v14 or higher) and npm
- Docker (optional, for containerization)
- Helm & Kubernetes (optional, for deployment)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/doublest/credit-target-calculator.git
   cd credit-target-calculator/kredit-app
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```
4. Open your browser and go to `http://localhost:3000`.

## 💡 Usage
1. **Calculate Payoff Date** 🗓️  
   - Enter your original loan amount and current remaining balance.  
   - Input your planned monthly payment.  
   - Click **Berechnen** to see the expected payoff month and year.

2. **Calculate Monthly Payment** 💸  
   - Enter your original loan amount and current remaining balance.  
   - Choose your desired payoff date.  
   - Click **Berechnen** to find out how much you need to pay each month.

## ☁️ Deployment with Helm
To deploy the application on Kubernetes using Helm:

1. Build and tag the Docker image:
   ```bash
   docker build -t kredit-app:latest -f kredit-app/Dockerfile .
   ```
2. Install the Helm chart:
   ```bash
   helm install kredit-app ./charts/kredit-app
   ```
3. By default, the service is exposed as a ClusterIP on port 80. To access it locally:
   ```bash
   kubectl port-forward svc/kredit-app 8080:80
   ```
4. Visit `http://localhost:8080` in your browser.

## 🤝 Contributing
Contributions are welcome! Feel free to open issues or submit pull requests.