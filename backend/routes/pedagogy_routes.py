"""
AI-Powered Vernacular Pedagogy API Endpoints
"""
from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from backend.models.schemas import PedagogyExplainRequest, PedagogyExplainResponse
from backend.services.pedagogy_engine import pedagogy_engine

router = APIRouter(prefix="/pedagogy", tags=["AI Vernacular Pedagogy"])

@router.post("/explain", response_model=PedagogyExplainResponse)
def explain_concept(req: PedagogyExplainRequest):
    """
    Transforms raw educational questions into culturally rooted vernacular pedagogy.
    Uses familiar local objects (kitchen steamers, rivers, mangoes, farms) instead of abstract terms.
    """
    try:
        return pedagogy_engine.explain_concept(req)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/metaphors", response_model=List[Dict[str, Any]])
def get_metaphors():
    """Returns curated Indian cultural metaphors categorized by subject and primary grade."""
    return pedagogy_engine.get_curated_metaphors()
