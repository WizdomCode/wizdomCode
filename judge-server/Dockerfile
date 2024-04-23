FROM python:3.9-buster

RUN apt-get update && apt-get install -y gcc g++ openjdk-11-jdk

COPY requirements.txt /app/
COPY judge.py /app/
COPY queue /app/queue
COPY results /app/results

WORKDIR /app

RUN pip install -r requirements.txt
RUN pip install Flask-CORS
RUN pip install socket
RUN pip install Flask-CORS gunicorn

CMD ["gunicorn", "--worker-class", "eventlet", "-w", "1", "-b", "0.0.0.0:5000", "judge.py"]