"""
Translation & Speech API Endpoints
"""
from fastapi import APIRouter, HTTPException, Response
from typing import List, Dict, Any
from backend.models.schemas import (
    TranslationRequest,
    TranslationResponse,
    SpeechSynthesisRequest,
    SpeechSynthesisResponse,
    SpeechTranscribeRequest,
    SpeechTranscribeResponse,
    LanguageDetectRequest,
    LanguageDetectResponse
)
from backend.services.translation_service import translation_service
from backend.services.speech_service import speech_service

router = APIRouter(tags=["Translation & Speech"])

@router.get("/languages", response_model=List[Dict[str, Any]])
def get_languages():
    """Returns all 12 supported mother tongues and languages with flags and speech codes."""
    return translation_service.get_supported_languages()

@router.post("/speech/detect-language", response_model=LanguageDetectResponse)
def detect_spoken_language(req: LanguageDetectRequest):
    """
    Automatically identifies the language spoken by another person from microphone transcription.
    """
    return speech_service.detect_language(req)

@router.post("/translate", response_model=TranslationResponse)
def translate_text(req: TranslationRequest):
    """
    Translates sentence or passage between English and 11 Indian mother tongues.
    Automatically detects source language if source_lang is 'auto'.
    """
    try:
        if req.source_lang == "auto":
            det = speech_service.detect_language(LanguageDetectRequest(text=req.text))
            req.source_lang = det.detected_lang
        return translation_service.translate(req)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/speech/synthesize", response_model=SpeechSynthesisResponse)
def synthesize_speech(req: SpeechSynthesisRequest):
    """
    Generates text-to-speech audio synthesis parameters calibrated for primary-school children.
    """
    return speech_service.synthesize_speech_metadata(req)

@router.post("/speech/transcribe", response_model=SpeechTranscribeResponse)
def transcribe_speech(req: SpeechTranscribeRequest):
    """
    Transcribes student speech and evaluates pronunciation clarity with encouragement.
    """
    return speech_service.transcribe_audio_input(req)

@router.get("/speech/tts")
@router.get("/tts")
def stream_tts_audio(text: str, lang: str = "ta"):
    """
    Streams authentic native speech audio (MP3) for any sentence in any supported language.
    Guarantees that the AI translator speaks back in the translated language on any device.
    """
    audio_bytes = speech_service.generate_tts_audio_bytes(text, lang)
    if not audio_bytes:
        raise HTTPException(status_code=400, detail="Could not synthesize TTS audio")
    return Response(
        content=audio_bytes, 
        media_type="audio/mpeg",
        headers={
            "Content-Disposition": "inline",
            "Cache-Control": "public, max-age=86400",
            "Access-Control-Allow-Origin": "*"
        }
    )

