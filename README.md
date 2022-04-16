# Ticketing app using Microservices Pattern

## Setting up infra

Below commands reference running from Ticketing directory

### Step 1. Build & Push Docker image 
```docker
docker build -t ayu5h/auth auth
docker push ayu5h/auth
```

### Step 2. Install nginx controller if deleted
```kubernetes
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.1.2/deploy/static/provider/cloud/deploy.yaml
```

### Step 3. Apply the infra/k8s
```kubernetes
kubectl apply -f infra/k8s
```

### Step 4. Add the jwt secret
```kubernetes
kubectl create secret generic jwt-secret --from-literal=JWT_KEY=MY_JWT_SECRET
```
## Making Changes

When a change is made to the Service, then the docker image needs to be rebuilt and pushed (Step 1 above). Then if the infra is already existing, then the deployment can be directly restarted to rollout the latest image
```kubernetes
kubectl rollout restart deployment auth-depl
```
