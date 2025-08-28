# Set the base image to Python 3.11
FROM python:3.11-slim

# Set the working directory in the container
WORKDIR /app

# Install poetry
RUN pip install poetry

# Copy the project files to the working directory
COPY pyproject.toml poetry.lock* ./

# Install dependencies using poetry
RUN poetry config virtualenvs.create false && poetry install --only main --no-interaction --no-ansi --no-root

# Copy the rest of the application's code
COPY . .

# Command to run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
