from collections import defaultdict
from datetime import datetime, timedelta, timezone

from app.db import supabase

LEVEL_BASE = {
    "beginner": 5,
    "easy": 10,
    "medium": 30,
    "hard": 100,
    "hell": 150,
}

LEVELS = ["beginner", "easy", "medium", "hard", "hell"]


def compute_score(
    level: str, n_hints: int, n_failed_submits: int, used_solution: bool
) -> int:
    if used_solution:
        return 0
    base = LEVEL_BASE.get(level, 0)
    return max(base - n_hints * 10 - n_failed_submits * 5, 0)


def _get_existing(user_id: str, exercise_id: str) -> dict | None:
    result = (
        supabase.table("scores")
        .select("*")
        .eq("user_id", user_id)
        .eq("exercise_id", exercise_id)
        .maybe_single()
        .execute()
    )
    return result.data if result else None


def _get_exercise_meta(user_id: str, exercise_id: str) -> dict:
    result = (
        supabase.table("exercises")
        .select("id,level,datasets(industry)")
        .eq("id", exercise_id)
        .eq("user_id", user_id)
        .single()
        .execute()
    )
    e = result.data
    return {
        "exercise_id": e["id"],
        "level": e["level"],
        "industry": e["datasets"]["industry"],
    }


def _upsert(user_id: str, meta: dict, patch: dict) -> dict:
    existing = _get_existing(user_id, meta["exercise_id"])

    if existing is None:
        row = {
            "user_id": user_id,
            "exercise_id": meta["exercise_id"],
            "level": meta["level"],
            "industry": meta["industry"],
            "n_hints": 0,
            "n_failed_submits": 0,
            "used_solution": False,
            "solved": False,
            **patch,
        }
        row["score"] = compute_score(
            row["level"], row["n_hints"], row["n_failed_submits"], row["used_solution"]
        )
        supabase.table("scores").insert(row).execute()
        return row

    if existing["solved"] or existing["used_solution"]:
        return existing

    merged = {**existing, **patch}
    merged["score"] = compute_score(
        merged["level"],
        merged["n_hints"],
        merged["n_failed_submits"],
        merged["used_solution"],
    )
    update_keys = set(patch.keys()) | {"score"}
    supabase.table("scores").update({k: merged[k] for k in update_keys}).eq(
        "id", existing["id"]
    ).execute()
    return merged


def record_hint(user_id: str, exercise_id: str) -> dict:
    meta = _get_exercise_meta(user_id, exercise_id)
    existing = _get_existing(user_id, exercise_id)
    n = (existing["n_hints"] if existing else 0) + 1
    return _upsert(user_id, meta, {"n_hints": n})


def record_failed_submit(user_id: str, exercise_id: str) -> dict:
    meta = _get_exercise_meta(user_id, exercise_id)
    existing = _get_existing(user_id, exercise_id)
    n = (existing["n_failed_submits"] if existing else 0) + 1
    return _upsert(user_id, meta, {"n_failed_submits": n})


def record_solved(user_id: str, exercise_id: str) -> dict:
    meta = _get_exercise_meta(user_id, exercise_id)
    return _upsert(
        user_id,
        meta,
        {"solved": True, "solved_at": datetime.now(timezone.utc).isoformat()},
    )


def record_solution_viewed(user_id: str, exercise_id: str) -> dict:
    meta = _get_exercise_meta(user_id, exercise_id)
    return _upsert(user_id, meta, {"used_solution": True, "score": 0})


def _parse_dt(value: str | None) -> datetime | None:
    if not value:
        return None
    return datetime.fromisoformat(value.replace("Z", "+00:00"))


def _compute_streaks(solved_dates: list[datetime.date]) -> tuple[int, int]:
    if not solved_dates:
        return 0, 0

    unique_days = sorted(set(solved_dates))
    today = datetime.now(timezone.utc).date()

    best = 1
    current_run = 1
    for i in range(1, len(unique_days)):
        if (unique_days[i] - unique_days[i - 1]).days == 1:
            current_run += 1
            best = max(best, current_run)
        else:
            current_run = 1

    streak = 0
    cursor = today
    day_set = set(unique_days)
    if cursor not in day_set:
        cursor = cursor - timedelta(days=1)
    while cursor in day_set:
        streak += 1
        cursor = cursor - timedelta(days=1)

    return streak, best


def get_summary(user_id: str) -> dict:
    result = (
        supabase.table("scores")
        .select("score,solved,solved_at,level,industry,created_at")
        .eq("user_id", user_id)
        .execute()
    )
    rows = result.data or []

    today = datetime.now(timezone.utc).date()
    week_start = today - timedelta(days=today.weekday())
    last_week_start = week_start - timedelta(days=7)
    last_week_end = week_start
    month_start = today.replace(day=1)

    solved_per_level = {lvl: 0 for lvl in LEVELS}
    by_industry: dict[str, int] = defaultdict(int)
    activity_buckets: dict[str, int] = {
        (today - timedelta(days=i)).isoformat(): 0 for i in range(6, -1, -1)
    }

    total_score = 0
    solved_this_week = 0
    solved_last_week = 0
    score_this_month = 0
    solved_dates: list = []

    for r in rows:
        total_score += r["score"] or 0
        if not r["solved"]:
            continue

        level = r["level"]
        if level in solved_per_level:
            solved_per_level[level] += 1
        by_industry[r["industry"]] += 1

        solved_at = _parse_dt(r.get("solved_at"))
        if solved_at is None:
            continue
        d = solved_at.date()
        solved_dates.append(d)

        if week_start <= d <= today:
            solved_this_week += 1
        elif last_week_start <= d < last_week_end:
            solved_last_week += 1

        if d >= month_start:
            score_this_month += r["score"] or 0

        key = d.isoformat()
        if key in activity_buckets:
            activity_buckets[key] += 1

    streak, best_streak = _compute_streaks(solved_dates)

    activity = [{"date": k, "count": v} for k, v in activity_buckets.items()]

    return {
        "total_score": total_score,
        "streak": streak,
        "best_streak": best_streak,
        "solved": solved_per_level,
        "solved_this_week": solved_this_week,
        "solved_last_week": solved_last_week,
        "score_this_month": score_this_month,
        "by_industry": dict(by_industry),
        "activity": activity,
    }
