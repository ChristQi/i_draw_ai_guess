import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Config:
    """Configuration class for the application."""
    
    # OpenAI Compatible API Configuration
    BASE_URL = os.getenv('BASE_URL')
    API_KEY = os.getenv('API_KEY')
    MODEL = os.getenv('MODEL')