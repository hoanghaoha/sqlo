from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import datasets, exercises, feedback, leaderboard, scores, users

app = FastAPI(title="Sqlo API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://sqlo.io",  # add your production URL
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router, prefix="/users", tags=["users"])
app.include_router(datasets.router, prefix="/datasets", tags=["datasets"])
app.include_router(exercises.router, prefix="/exercises", tags=["excercises"])
app.include_router(scores.router, prefix="/scores", tags=["scores"])
app.include_router(feedback.router, prefix="/feedback", tags=["feedback"])
app.include_router(leaderboard.router, prefix="/leaderboard", tags=["leaderboard"])


@app.get("/health")
async def health():
    return {"status": "ok"}
