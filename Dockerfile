


FROM python:3.11-slim

# Set working directory to /app (project root)
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    && rm -rf /var/lib/apt/lists/*


# Copy requirements and install
COPY requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code (all contents of backend/ into /app/backend)
# Copy backend code (all contents of backend/app and backend/core)
# Copy backend code (all contents of backend/app)
COPY backend/app ./backend/app
# Copy ML and frontend folders
COPY ml ./ml
COPY frontend ./frontend

# Expose port
EXPOSE 7860

# Set PYTHONPATH so 'app' imports work
ENV PYTHONPATH=/app/backend

# Run the application
CMD ["python", "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "7860"]
