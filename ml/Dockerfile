FROM python:3.11-slim

WORKDIR /app 

RUN apt-get update && apt-get install -y --no-install-recommends libgomp1

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5000

# --bind 0.0.0.0:5000: Makes the server accessible from outside the container.
# --workers 2: Runs two worker processes to handle requests (a good starting point).
# app:app: The first 'app' is the name of your Python file (app.py), and the second 'app'
# is the name of the Flask instance inside that file (e.g., app = Flask(__name__)).
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "2", "app:app"]
