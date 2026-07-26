#!/bin/bash
set -e

echo "🔧 Starting setup..."

# ─── Docker ───────────────────────────────────────────
if ! command -v docker &> /dev/null; then
  echo "📦 Installing Docker..."
  curl -fsSL https://get.docker.com -o get-docker.sh
  sh get-docker.sh
  rm get-docker.sh
  echo "✅ Docker installed!"
else
  echo "✅ Docker already installed!"
fi

# ─── Kubectl ──────────────────────────────────────────
if ! command -v kubectl &> /dev/null; then
  echo "📦 Installing Kubectl..."
  curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
  sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
  rm kubectl
  echo "✅ Kubectl installed!"
else
  echo "✅ Kubectl already installed!"
fi

# ─── Minikube ─────────────────────────────────────────
if ! command -v minikube &> /dev/null; then
  echo "📦 Installing Minikube..."
  curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
  sudo install minikube-linux-amd64 /usr/local/bin/minikube
  rm minikube-linux-amd64
  echo "✅ Minikube installed!"
fi

# ─── Minikube Start ───────────────────────────────────
echo "🚀 Starting Minikube..."
minikube delete --all --purge 2>/dev/null || true

minikube start \
  --memory=2560mb \
  --cpus=2 \
  --driver=docker

echo "⏳ Waiting for Minikube to be ready..."
kubectl wait --for=condition=Ready node/minikube --timeout=120s

# ─── Addons ───────────────────────────────────────────
echo "🔌 Enabling addons..."
minikube addons enable ingress
minikube addons enable metrics-server

# ─── Verify ───────────────────────────────────────────
echo ""
echo "─────────────────────────────"
minikube status
echo "─────────────────────────────"
kubectl get nodes
echo "─────────────────────────────"
echo "✅ Setup complete!"