from motor.motor_asyncio import AsyncIOMotorClient
from .config import settings

client = AsyncIOMotorClient(settings.mongodb_url)
db = client.preplace

# Collections
users_col      = db.users
jobs_col       = db.jobs
applications_col = db.applications