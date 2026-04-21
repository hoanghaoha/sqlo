import {
  IconBolt,
  IconChessKing,
  IconChevronsUp,
  IconDashboard,
  IconDatabase,
  IconFlame,
  IconHeartShare,
  IconLeaf,
  IconMoodSmile,
  IconSkull,
  IconTreadmill,
  IconTriangleSquareCircle,
  IconUserCircle,
  type Icon,
} from "@tabler/icons-react"

type NavItem = {
  title: string
  url: string
  icon: Icon
}

export const data: {
  navWorkpsace: NavItem[]
  navCommnity: NavItem[]
  navUser: NavItem[]
} = {
  navWorkpsace: [
    { title: "Dashboard", url: "/dashboard", icon: IconDashboard },
    { title: "Datasets", url: "/datasets", icon: IconDatabase },
    { title: "Practice", url: "/practice", icon: IconTreadmill },
  ],
  navCommnity: [
    { title: "LeaderBoard", url: "/leaderboard", icon: IconChessKing },
    { title: "Exercises", url: "/exercises", icon: IconTriangleSquareCircle },
  ],
  navUser: [
    { title: "Account", url: "/account", icon: IconUserCircle },
    { title: "Feedback", url: "/feedback", icon: IconHeartShare },
    { title: "Upgrade Plan", url: "/plan", icon: IconChevronsUp },
  ],
}

export const EXERCISE_LEVELS: {
  value: string
  label: string
  color: string
  icon: Icon
}[] = [
  { value: "beginner", label: "Beginner", color: "text-gray-600 dark:text-gray-400", icon: IconLeaf },
  { value: "easy", label: "Easy", color: "text-green-600 dark:text-green-400", icon: IconMoodSmile },
  { value: "medium", label: "Medium", color: "text-yellow-600 dark:text-yellow-400", icon: IconBolt },
  { value: "hard", label: "Hard", color: "text-red-600 dark:text-red-400", icon: IconFlame },
  { value: "hell", label: "Hell", color: "text-violet-600 dark:text-violet-400", icon: IconSkull },
]

export const EXERCISE_LEVEL_MAP = Object.fromEntries(
  EXERCISE_LEVELS.map(l => [l.value, l])
) as Record<string, (typeof EXERCISE_LEVELS)[number]>

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
