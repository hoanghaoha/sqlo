import { IconBrain, IconChessKing, IconChevronsUp, IconDashboard, IconDatabase, IconHeartShare, IconTreadmill, IconTriangleSquareCircle } from "@tabler/icons-react"

export const data = {
  navWorkpsace: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: (
        <IconDashboard />
      ),
    },
    {
      title: "Datasets",
      url: "/datasets",
      icon: (
        <IconDatabase
        />
      ),
    },
    {
      title: "Practice",
      url: "/practice",
      icon: (
        <IconTreadmill
        />
      ),
    },
    {
      title: "AI Teacher",
      url: "/ai",
      icon: (
        <IconBrain
        />
      ),
    },
  ],
  navCommnity: [
    {
      title: "LeaderBoard",
      url: "/leaderboard",
      icon: (
        <IconChessKing />
      ),
    },
    {
      title: "Exercises",
      url: "/exercises",
      icon: (
        <IconTriangleSquareCircle />
      ),
    },
  ],
  navMore: [
    {
      title: "Feedback",
      url: "/feedback",
      icon: (
        <IconHeartShare />
      ),
    },
    {
      title: "Upgrade Plan",
      url: "/plan",
      icon: (
        <IconChevronsUp />
      ),
    },
  ],
}

export const EXERCISE_LEVELS = [
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
]

export const EXERCISE_LEVEL_COLOR: Record<string, string> = {
  easy: "text-green-600 dark:text-green-400",
  medium: "text-yellow-600 dark:text-yellow-400",
  hard: "text-red-600 dark:text-red-400",
}

export const EXERCISE_TOPIC_GROUPS: { label: string; topics: string[] }[] = [
  { label: "Basics", topics: ["SELECT", "WHERE", "DISTINCT", "ORDER BY", "LIMIT", "LIKE", "IN", "BETWEEN", "IS NULL"] },
  { label: "Joins", topics: ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL JOIN", "CROSS JOIN", "SELF JOIN"] },
  { label: "Aggregation", topics: ["GROUP BY", "HAVING", "COUNT", "SUM", "AVG", "MIN", "MAX"] },
  { label: "Subqueries", topics: ["Subquery", "Correlated Subquery", "EXISTS", "ANY / ALL"] },
  { label: "Set Operations", topics: ["UNION", "UNION ALL", "INTERSECT", "EXCEPT"] },
  { label: "Window Functions", topics: ["ROW_NUMBER", "RANK", "DENSE_RANK", "LAG", "LEAD", "NTILE", "PARTITION BY", "Running Total", "Moving Average"] },
  { label: "CTEs", topics: ["CTE", "Recursive CTE"] },
  { label: "Conditionals", topics: ["CASE", "COALESCE", "NULLIF", "IFNULL"] },
  { label: "Functions", topics: ["String Functions", "Date Functions", "Numeric Functions", "Type Casting"] },
  { label: "Shaping", topics: ["Pivot", "Unpivot"] },
  { label: "DML", topics: ["INSERT", "UPDATE", "DELETE", "UPSERT"] },
]

export const EXERCISE_MAX_TOPICS = 3
