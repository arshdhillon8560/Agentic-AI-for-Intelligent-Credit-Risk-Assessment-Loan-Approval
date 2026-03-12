import pandas as pd
import joblib
import os

from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier


BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

data_path = os.path.join(BASE_DIR, "datasets", "loan_fraud_detection_dataset_50k.csv")

data = pd.read_csv(data_path)


X = data.drop(["fraud_probability", "fraud_flag"], axis=1)
y = data["fraud_flag"]


X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)


models = {
    "RandomForest": RandomForestClassifier(
        n_estimators=200,
        max_depth=10
    ),
    "XGBoost": XGBClassifier(
        n_estimators=200,
        learning_rate=0.05
    )
}

best_model = None
best_score = 0

for name, model in models.items():

    model.fit(X_train, y_train)

    preds = model.predict(X_test)

    acc = accuracy_score(y_test, preds)

    print(name, "Accuracy:", acc)

    if acc > best_score:
        best_score = acc
        best_model = model


models_dir = os.path.join(BASE_DIR, "models")
os.makedirs(models_dir, exist_ok=True)


joblib.dump(best_model, os.path.join(models_dir, "fraud_model.pkl"))

print("Fraud model saved successfully")