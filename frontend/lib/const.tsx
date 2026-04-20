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
