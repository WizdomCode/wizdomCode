FROM python:3.9-buster

RUN apt-get update && apt-get install -y gcc g++ openjdk-11-jdk

COPY requirements.txt /app/
COPY judge.py /app/

WORKDIR /app

RUN pip install -r requirements.txt

CMD [ "python", "judge.py" ]
