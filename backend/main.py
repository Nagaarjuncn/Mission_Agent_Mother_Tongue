"""
Mission Agent Mother-Tongue Master FastAPI Application Server
Mother-Tongue-Based Primary Education AI Platform
"""
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse, FileResponse

from backend.config import settings
from backend.routes.translate_routes import router as translate_router
from backend.routes.pedagogy_routes import router as pedagogy_router
from backend.routes.tutor_routes import router as tutor_router
from backend.routes.lesson_routes import router as lesson_router
from backend.routes.quiz_routes import router as quiz_router
from backend.routes.dashboard_routes import router as dashboard_router
from backend.routes.demo_routes import router as demo_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="""
# Mission Agent Mother-Tongue 🇮🇳📚

Mission Agent Mother-Tongue is an AI-powered educational web platform enabling mother-tongue-based primary education (ages 5–12).
It bridges linguistic divides through:
- **AI Real-Time Translation** across 11+ Indian languages with phonetic reading guides
- **AI Vernacular Pedagogy Engine** adapting abstract concepts into culturally rooted Indian metaphors
- **AI Vernacular Tutor ('Mitra')** providing interactive Socratic dialog, misconception checks, and scaffolding hints
- **Teacher AI Lesson Generator** producing 7-stage classroom plans, stories, and activities
- **Voice-Based Learning** with child-friendly speech synthesis and pronunciation feedback
- **Dashboards** for Student, Teacher cohort analytics, and Parent insights
- **Live 3-5 Minute Hackathon Presentation Flow**
    """,
    docs_url="/docs",
    redoc_url="/redoc"
)

# Enable CORS for frontend clients
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers under /api
app.include_router(translate_router, prefix=settings.API_PREFIX)
app.include_router(pedagogy_router, prefix=settings.API_PREFIX)
app.include_router(tutor_router, prefix=settings.API_PREFIX)
app.include_router(lesson_router, prefix=settings.API_PREFIX)
app.include_router(quiz_router, prefix=settings.API_PREFIX)
app.include_router(dashboard_router, prefix=settings.API_PREFIX)
app.include_router(demo_router, prefix=settings.API_PREFIX)

@app.get("/health", tags=["System"])
@app.get("/api/health", tags=["System"])
def health_check():
    """Health check endpoint for container and uptime monitoring."""
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "supported_languages_count": len(settings.SUPPORTED_LANGUAGES),
        "offline_engine_active": True,
        "gemini_configured": bool(settings.GEMINI_API_KEY)
    }

@app.get("/host-info", tags=["System"])
@app.get("/api/host-info", tags=["System"])
def get_host_info():
    """
    Returns active permanent / secured host link (Cloudflare Tunnel, TLS status, QR code support).
    """
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    host_file = os.path.join(base_dir, "HOST_LINK.txt")
    json_file = os.path.join(base_dir, "host_status.json")
    
    live_url = ""
    status = "ready"
    
    if os.path.isfile(json_file):
        try:
            import json
            with open(json_file, "r", encoding="utf-8") as f:
                data = json.load(f)
                live_url = data.get("url", "")
                status = data.get("status", "active")
        except Exception:
            pass
            
    if not live_url and os.path.isfile(host_file):
        try:
            with open(host_file, "r", encoding="utf-8") as f:
                content = f.read().strip()
                if "http" in content:
                    live_url = content
                    status = "active"
        except Exception:
            pass

    return {
        "service": settings.PROJECT_NAME,
        "is_secured_host": bool(live_url and live_url.startswith("https")),
        "host_url": live_url or "http://localhost:8000",
        "protocol": "HTTPS (TLS 1.3)" if (live_url and live_url.startswith("https")) else "HTTP",
        "tunnel_type": "Cloudflare Secured Tunnel",
        "status": status,
        "microphone_ready": True,
        "permanent_domain_guide": "Run .\\start_permanent_host.ps1 to generate or maintain your permanent encrypted HTTPS link with mobile microphone permissions."
    }

# Mount static frontend files if directory exists
frontend_dir = settings.FRONTEND_DIR
frontend_index = os.path.join(frontend_dir, "index.html")
if os.path.isfile(frontend_index):
    styles_dir = os.path.join(frontend_dir, "styles")
    js_dir = os.path.join(frontend_dir, "js")
    assets_dir = os.path.join(frontend_dir, "assets")
    if os.path.isdir(styles_dir):
        app.mount("/styles", StaticFiles(directory=styles_dir), name="styles")
    if os.path.isdir(js_dir):
        app.mount("/js", StaticFiles(directory=js_dir), name="js")
    if os.path.isdir(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/", tags=["Frontend"])
    def serve_frontend_root():
        """Serves the VernacLearn frontend web application."""
        return FileResponse(frontend_index)

    @app.get("/index.html", tags=["Frontend"], include_in_schema=False)
    def serve_frontend_index():
        """Redirects or serves index.html."""
        return FileResponse(frontend_index)

if __name__ == "__main__":
    import uvicorn
    print(f"Starting {settings.PROJECT_NAME} on http://localhost:{settings.PORT}")
    print(f"Interactive API Docs: http://localhost:{settings.PORT}/docs")
    uvicorn.run("backend.main:app", host=settings.HOST, port=settings.PORT, reload=True)
