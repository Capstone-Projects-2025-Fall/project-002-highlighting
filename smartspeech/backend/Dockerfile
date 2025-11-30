# Python 3.10
FROM python:3.10-slim

# Set base dir
WORKDIR /code

# Copy dependency list
COPY ./requirements.txt /code/requirements.txt

# Install dependencies
RUN pip install uvicorn
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

# Install spaCy model explicitly (avoids the bad auto-generated URL seen on some environments)
RUN python -m pip install https://github.com/explosion/spacy-models/releases/download/en_core_web_lg-3.7.1/en_core_web_lg-3.7.1-py3-none-any.whl

# Copy application code
COPY ./src /code/src

# Copy environment
# COPY ./.env /code/.env

# Start server
# uvicorn src.main:app --host 0.0.0.0 --port 8000 --env-file /code/src/.env.local
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000", "--env-file", "/code/src/.env.local"]
