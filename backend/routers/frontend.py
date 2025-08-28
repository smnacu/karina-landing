from fastapi import APIRouter, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates

router = APIRouter()
templates = Jinja2Templates(directory="templates")

@router.get("/", response_class=HTMLResponse)
async def home(request: Request):
    # We will add logic to fetch instagram feed later
    return templates.TemplateResponse("home.html", {"request": request, "instagram_posts": []})

@router.get("/agenda", response_class=HTMLResponse)
async def agenda(request: Request):
    # We will add logic to fetch events later
    return templates.TemplateResponse("agenda.html", {"request": request, "events": []})
