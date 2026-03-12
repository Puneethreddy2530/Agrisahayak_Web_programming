import sys
import os

# add backend to path
sys.path.append(os.path.join(os.path.abspath('.'), 'backend'))
from app.ml_service import predict_crop

try:
    print("Running predict_crop...")
    res = predict_crop(nitrogen=50, phosphorus=40, potassium=30, temperature=28, humidity=70, ph=6.5, rainfall=150)
    print("Success:")
    print(res)
except Exception as e:
    import traceback
    traceback.print_exc()
