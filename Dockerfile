# PRODUCTION
FROM python:3.9-buster

ENV PORT=8000



# Copy local code to the container image.
COPY . .

RUN pip install -r requirements.txt

EXPOSE 8000
CMD ["uvicorn", "main:app", "--reload"]
 

 