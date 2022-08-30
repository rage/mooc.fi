echo "Configuring Google Cloud"
echo $GCLOUD_SERVICE_KEY >${HOME}/gcloud-service-key.json
gcloud auth activate-service-account --key-file=${HOME}/gcloud-service-key.json
gcloud --quiet config set project ${GOOGLE_PROJECT_ID}
gcloud --quiet config set compute/region ${GOOGLE_COMPUTE_REGION}
gcloud --quiet config set compute/zone ${GOOGLE_COMPUTE_ZONE}

echo "Configuring kubectl"
gcloud --quiet container clusters get-credentials moocfi-cluster

# if ! [ -x "$(command -v gke-gcloud-auth-plugin)" ]; then
#   echo "kubectl plugin gke-gcloud-auth-plugin not found. Installing..."
#   echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] https://packages.cloud.google.com/apt cloud-sdk main" | sudo tee -a /etc/apt/sources.list.d/google-cloud-sdk.list
#   curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key --keyring /usr/share/keyrings/cloud.google.gpg add -
#   apt-get update 
#   apt-get install -y google-cloud-sdk-gke-gcloud-auth-plugin
# fi

BRANCH=$(git rev-parse --abbrev-ref HEAD)

if [[ "$BRANCH" == "staging" ]]; then
  kubectl config set-context "$GOOGLE_CLUSTER_NAME" --namespace=moocfi-staging
else
  kubectl config set-context "$GOOGLE_CLUSTER_NAME" --namespace=moocfi
fi

echo "Logging in to docker"
gcloud auth print-access-token | docker login -u oauth2accesstoken --password-stdin https://eu.gcr.io

