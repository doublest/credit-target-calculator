# credit-target-calculator
A simple credit target calculator application built with Node.js, Express, and a static front-end.

## Deploying with Helm

First, build and tag the Docker image locally:

```
docker build -t kredit-app:latest -f kredit-app/Dockerfile .
```

Then install the Helm chart provided in `charts/kredit-app`:

```
helm install kredit-app ./charts/kredit-app
```

By default the chart exposes a ClusterIP service on port 80. To access it locally, port‑forward:

```
kubectl port-forward svc/kredit-app 8080:80
```

Open http://localhost:8080 in your browser to see the application.