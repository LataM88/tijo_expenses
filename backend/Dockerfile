FROM python:3.12-slim

ENV PYTHONUNBUFFERED=1

# Install uv package manager
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

WORKDIR /app

# Install backend dependencies if defined
COPY pyproject.toml ./
RUN uv sync --no-install-project

COPY . .

EXPOSE 8000

CMD ["uv", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

