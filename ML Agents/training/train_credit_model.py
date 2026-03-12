import pandas as pd
import joblib
import os

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import roc_auc_score, accuracy_score

from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from xgboost import XGBClassifier

# Load dataset
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
data_path = os.path.join(BASE_DIR, "datasets", "loan_credit_pd_dataset_50k.csv")

data = pd.read_csv(data_path)

X = data.drop(["pd_score","default"],axis=1)
y = data["default"]

X_train,X_test,y_train,y_test = train_test_split(
    X,y,test_size=0.2,random_state=42
)

scaler = StandardScaler()

X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)

models = {
    "RandomForest": RandomForestClassifier(
        n_estimators=200,max_depth=10
    ),
    "LogisticRegression": LogisticRegression(max_iter=500),
    "XGBoost": XGBClassifier(
        n_estimators=200,
        max_depth=6,
        learning_rate=0.05
    )
}

best_model=None
best_score=0

for name,model in models.items():

    model.fit(X_train,y_train)

    preds = model.predict(X_test)
    prob = model.predict_proba(X_test)[:,1]

    acc = accuracy_score(y_test,preds)
    auc = roc_auc_score(y_test,prob)

    print(name,"Accuracy:",acc,"AUC:",auc)

    if auc > best_score:
        best_score = auc
        best_model = model

models_dir = os.path.join(BASE_DIR, "models")

# create folder if not exists
os.makedirs(models_dir, exist_ok=True)

joblib.dump(best_model, os.path.join(models_dir, "credit_model.pkl"))
joblib.dump(scaler, os.path.join(models_dir, "scaler.pkl"))

print("Best credit model saved")