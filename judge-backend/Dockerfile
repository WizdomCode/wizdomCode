FROM public.ecr.aws/lambda/python:3.11

RUN yum update -y && yum install -y gcc-c++
RUN yum install java-1.8.0-openjdk-devel -y

COPY requirements.txt ${LAMBDA_TASK_ROOT}

COPY lambda_function.py ${LAMBDA_TASK_ROOT}

RUN pip install -r requirements.txt

CMD [ "lambda_function.handler" ]