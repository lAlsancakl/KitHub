from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from routes.pageRoutes import router as page_router
from routes.api import router as api_router

app = FastAPI()

# Statik dosyaları (CSS, JS, Resimler) dışarıya açıyoruz
app.mount("/public", StaticFiles(directory="public"), name="public")
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Sayfa yönlendirme router'ını ana uygulamaya bağlıyoruz
app.include_router(page_router)
app.include_router(api_router)

# mysqldump -u root -p kithub_db > kithub_backup.sql
# mysql -u root -p kithub_db < kithub_backup.sql