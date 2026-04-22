import {
  IconBolt,
  IconBuildingFactory2,
  IconBuildingSkyscraper,
  IconCircle,
  IconCircleFilled,
  IconCirclesFilled,
  IconHome,
  IconChessKing,
  IconChevronsUp,
  IconDashboard,
  IconDatabase,
  IconDeviceLaptop,
  IconFlame,
  IconHeartShare,
  IconLeaf,
  IconMoodSmile,
  IconMoodSmileBeam,
  IconShoppingCart,
  IconSkull,
  IconStethoscope,
  IconTrendingUp,
  IconTreadmill,
  IconTriangleSquareCircle,
  IconTruck,
  IconUsersGroup,
  IconUserCircle,
  IconSchool,
  IconChartBar,
  IconMovie,
  IconToolsKitchen2,
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
    { title: "Profile", url: "/profile", icon: IconUserCircle },
    { title: "Feedback", url: "/feedback", icon: IconHeartShare },
    { title: "Upgrade Plan", url: "/plan", icon: IconChevronsUp },
  ],
}

export const DATASET_SIZES: { value: string; label: string; icon: Icon }[] = [
  { value: "small", label: "Small", icon: IconCircle },
  { value: "medium", label: "Medium", icon: IconCircleFilled },
  { value: "large", label: "Large", icon: IconCirclesFilled },
]

export const DATASET_INDUSTRIES: { value: string; label: string; icon: Icon }[] = [
  { value: "E-commerce", label: "E-Commerce", icon: IconShoppingCart },
  { value: "Healthcare", label: "Healthcare", icon: IconStethoscope },
  { value: "Finance", label: "Finance", icon: IconTrendingUp },
  { value: "Retail", label: "Retail", icon: IconBuildingSkyscraper },
  { value: "Technology", label: "Technology", icon: IconDeviceLaptop },
  { value: "Education", label: "Education", icon: IconSchool },
  { value: "Logistics", label: "Logistics", icon: IconTruck },
  { value: "Market Research", label: "Market Research", icon: IconChartBar },
  { value: "Manufacturing", label: "Manufacturing", icon: IconBuildingFactory2 },
  { value: "Real Estate", label: "Real Estate", icon: IconHome },
  { value: "Media & Entertainment", label: "Media & Entertainment", icon: IconMovie },
  { value: "HR / Workforce", label: "HR / Workforce", icon: IconUsersGroup },
  { value: "Food & Beverage", label: "Food & Beverage", icon: IconToolsKitchen2 },
  { value: "Other", label: "Other", icon: IconMoodSmileBeam },
]

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
  { label: "Subqueries", topics: ["SUBQUERY", "CORRELATED SUBQUERY", "EXISTS", "ANY / ALL"] },
  { label: "Set Operations", topics: ["UNION", "UNION ALL", "INTERSECT", "EXCEPT"] },
  { label: "Window Functions", topics: ["ROW_NUMBER", "RANK", "DENSE_RANK", "LAG", "LEAD", "NTILE", "PARTITION BY", "RUNNING TOTAL", "MOVING AVERAGE"] },
  { label: "CTEs", topics: ["CTE", "RECURSIVE CTE"] },
  { label: "Conditionals", topics: ["CASE", "COALESCE", "NULLIF", "IFNULL"] },
  { label: "Functions", topics: ["STRING FUNCTIONS", "DATE FUNCTIONS", "NUMERIC FUNCTIONS", "TYPE CASTING"] },
  { label: "Shaping", topics: ["PIVOT", "UNPIVOT"] },
]

export const EXERCISE_MAX_TOPICS = 5
