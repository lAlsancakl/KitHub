from fastapi import APIRouter, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates

router = APIRouter()

# Eğer HTML dosyalarını FastAPI templates üzerinden render ediyorsan:
# templates = Jinja2Templates(directory="public/views") 

@router.get("/", response_class=HTMLResponse)
async def read_index(request: Request):
    # Doğrudan dosya okuyarak da döndürebilirsin veya template kullanabilirsin
    with open("public/views/index.html", "r", encoding="utf-8") as f:
        return f.read()

@router.get("/login", response_class=HTMLResponse)
async def read_login(request: Request):
    with open("public/views/login.html", "r", encoding="utf-8") as f:
        return f.read()

@router.get("/signup", response_class=HTMLResponse)
async def read_signup(request: Request):
    with open("public/views/signup.html", "r", encoding="utf-8") as f:
        return f.read()