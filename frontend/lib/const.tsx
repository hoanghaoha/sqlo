import { IconDashboard, IconDatabase, IconTreadmill } from "@tabler/icons-react"

export const data = {
  navMain: [
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
  ],
}
