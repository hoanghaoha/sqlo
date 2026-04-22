from datetime import datetime, timedelta, timezone
from typing import Literal

from fastapi import APIRouter, Depends

from app.auth.jwt import get_current_user
from app.db import supabase

router = APIRouter()

RANKS = [
    ("Challenger", 20000),
    ("Master", 10000),
    ("Diamond", 5000),
    ("Platinum", 2000),
    ("Gold", 1000),
    ("Silver", 500),
    ("Bronze", 0),
]


def _rank_name(score: int) -> str:
    for name, minimum in RANKS:
        if score >= minimum:
            return name
    return "Bronze"


def _period_cutoff(period: str) -> str | None:
    now = datetime.now(timezone.utc)
    if period == "this_week":
        cutoff = now - timedelta(days=now.weekday())
        return cutoff.replace(hour=0, minute=0, second=0, microsecond=0).isoformat()
    if period == "this_month":
        cutoff = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        return cutoff.isoformat()
    return None


@router.get("/")
async def get_leaderboard_endpoint(
    period: Literal["all_time", "this_month", "this_week"] = "all_time",
    user_id: str = Depends(get_current_user),
):
    cutoff = _period_cutoff(period)

    scores_query = supabase.table("scores").select("user_id,score,solved")
    if cutoff:
        scores_query = scores_query.gte("created_at", cutoff)
    scores_result = scores_query.execute()

    rows = scores_result.data or []

    totals: dict[str, dict] = {}
    for r in rows:
        uid = r["user_id"]
        if uid not in totals:
            totals[uid] = {"total_score": 0, "solved_count": 0}
        totals[uid]["total_score"] += r["score"] or 0
        if r["solved"]:
            totals[uid]["solved_count"] += 1

    if not totals:
        current = await _get_current_user_entry(user_id, period)
        return {"entries": [], "current_user": current}

    user_ids = list(totals.keys())
    profiles_result = (
        supabase.table("leaderboard")
        .select("user_id,display_name,avatar_url")
        .in_("user_id", user_ids)
        .execute()
    )
    profile_map = {p["user_id"]: p for p in (profiles_result.data or [])}

    entries = []
    for uid, agg in totals.items():
        profile = profile_map.get(uid, {})
        entries.append({
            "user_id": uid,
            "display_name": profile.get("display_name") or "Anonymous",
            "avatar_url": profile.get("avatar_url"),
            "total_score": agg["total_score"],
            "solved_count": agg["solved_count"],
            "rank_name": _rank_name(agg["total_score"]),
        })

    entries.sort(key=lambda e: (-e["total_score"], -e["solved_count"]))
    for i, entry in enumerate(entries):
        entry["rank"] = i + 1

    current_user_entry = next((e for e in entries if e["user_id"] == user_id), None)
    if current_user_entry is None:
        current_user_entry = await _get_current_user_entry(user_id, period)

    return {"entries": entries[:50], "current_user": current_user_entry}


async def _get_current_user_entry(user_id: str, period: str) -> dict | None:
    cutoff = _period_cutoff(period)
    q = supabase.table("scores").select("score,solved").eq("user_id", user_id)
    if cutoff:
        q = q.gte("created_at", cutoff)
    result = q.execute()
    rows = result.data or []

    total_score = sum(r["score"] or 0 for r in rows)
    solved_count = sum(1 for r in rows if r["solved"])

    profile = (
        supabase.table("leaderboard")
        .select("display_name,avatar_url")
        .eq("user_id", user_id)
        .maybe_single()
        .execute()
    )
    p = profile.data or {}

    return {
        "user_id": user_id,
        "display_name": p.get("display_name") or "Anonymous",
        "avatar_url": p.get("avatar_url"),
        "total_score": total_score,
        "solved_count": solved_count,
        "rank_name": _rank_name(total_score),
        "rank": None,
    }
