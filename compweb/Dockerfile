FROM python:3.9-buster

# Install required packages
RUN apt-get update && apt-get install -y gcc g++ openjdk-11-jdk

# Install Firebase Admin SDK and Flask-CORS
RUN pip install firebase-admin Flask-CORS

# Copy the requirements and judge.py files
COPY requirements.txt /app/
COPY judge.py /app/
COPY queue /app/queue
COPY results /app/results

# Copy the service account key JSON file
COPY serviceAccountKey.json /app/

# Set the working directory
WORKDIR /app

# Install Python dependencies
RUN pip install -r requirements.txt

# Command to run the Flask application
CMD [ "python", "judge.py" ]