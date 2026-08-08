import { ActivityEntry } from '../types/activity'

const TODAY = new Date('2026-07-16')
const YESTERDAY = new Date(TODAY)
YESTERDAY.setDate(YESTERDAY.getDate() - 1)
const LAST_WEEK = new Date(TODAY)
LAST_WEEK.setDate(LAST_WEEK.getDate() - 7)

export const ACTIVITY: ActivityEntry[] = [
  {
    id: '1',
    seriesId: 'jjk',
    seriesTitle: 'Jujutsu Kaisen Season 2',
    coverUrl: '/placeholder.svg?height=80&width=60',
    mediaType: 'anime',
    actionType: 'completed',
    actionLabel: 'Finished Season 2',
    progress: { current: 50, total: 50 },
    note: 'Amazing season! Best arc so far.',
    date: TODAY,
    time: '2:30 PM',
  },
  {
    id: '2',
    seriesId: 'blue-lock',
    seriesTitle: 'Blue Lock',
    coverUrl: '/placeholder.svg?height=80&width=60',
    mediaType: 'anime',
    actionType: 'started',
    actionLabel: 'Started watching',
    progress: { current: 3, total: 24 },
    date: TODAY,
    time: '1:15 PM',
  },
  {
    id: '3',
    seriesId: 'op-wano',
    seriesTitle: 'One Piece: Wano Country',
    coverUrl: '/placeholder.svg?height=80&width=60',
    mediaType: 'anime',
    actionType: 'rated',
    actionLabel: 'Rated 4.5/5',
    date: TODAY,
    time: '11:45 AM',
  },
  {
    id: '4',
    seriesId: 'chainsaw-man',
    seriesTitle: 'Chainsaw Man Chapter 142',
    coverUrl: '/placeholder.svg?height=80&width=60',
    mediaType: 'manga',
    actionType: 'completed',
    actionLabel: 'Finished reading',
    date: YESTERDAY,
    time: '9:20 PM',
  },
  {
    id: '5',
    seriesId: 'aot-manga',
    seriesTitle: 'Attack on Titan: The Final Season',
    coverUrl: '/placeholder.svg?height=80&width=60',
    mediaType: 'manga',
    actionType: 'reviewed',
    actionLabel: 'Left a review',
    note: 'The ending was bittersweet but satisfying.',
    date: YESTERDAY,
    time: '6:30 PM',
  },
  {
    id: '6',
    seriesId: 'manga-solo',
    seriesTitle: 'Solo Leveling',
    coverUrl: '/placeholder.svg?height=80&width=60',
    mediaType: 'manga',
    actionType: 'started',
    actionLabel: 'Started reading',
    progress: { current: 5, total: 200 },
    date: YESTERDAY,
    time: '4:10 PM',
  },
  {
    id: '7',
    seriesId: 'sword-oratoria',
    seriesTitle: 'Sword Oratoria',
    coverUrl: '/placeholder.svg?height=80&width=60',
    mediaType: 'light-novel',
    actionType: 'completed',
    actionLabel: 'Finished Volume 3',
    progress: { current: 3, total: 3 },
    date: YESTERDAY,
    time: '2:45 PM',
  },
  {
    id: '8',
    seriesId: 'rezero-ln',
    seriesTitle: 'Re:Zero Light Novel',
    coverUrl: '/placeholder.svg?height=80&width=60',
    mediaType: 'light-novel',
    actionType: 'rated',
    actionLabel: 'Rated 4/5',
    note: 'Compelling characters and story depth.',
    date: LAST_WEEK,
    time: '8:00 PM',
  },
  {
    id: '9',
    seriesId: 'promised-neverland',
    seriesTitle: 'The Promised Neverland',
    coverUrl: '/placeholder.svg?height=80&width=60',
    mediaType: 'anime',
    actionType: 'reviewed',
    actionLabel: 'Left a review',
    note: 'Psychological thriller that keeps you on the edge.',
    date: LAST_WEEK,
    time: '5:15 PM',
  },
  {
    id: '10',
    seriesId: 'ln-series',
    seriesTitle: 'Is It Wrong to Try to Pick Up Girls in a Dungeon?',
    coverUrl: '/placeholder.svg?height=80&width=60',
    mediaType: 'light-novel',
    actionType: 'started',
    actionLabel: 'Started reading',
    progress: { current: 1, total: 19 },
    date: LAST_WEEK,
    time: '3:30 PM',
  },
  {
    id: '11',
    seriesId: 'demon-slayer',
    seriesTitle: 'Demon Slayer: Entertainment Arc',
    coverUrl: '/placeholder.svg?height=80&width=60',
    mediaType: 'anime',
    actionType: 'rated',
    actionLabel: 'Rated 5/5',
    note: 'Animation was absolutely stunning.',
    date: LAST_WEEK,
    time: '10:00 AM',
  },
]

export const getActivityStats = (activities: ActivityEntry[], days = 30) => {
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  const completed = activities.filter(
    (a) => a.actionType === 'completed' && a.date >= startDate
  ).length
  
  const streak = calculateStreak(activities)
  const hours = Math.floor(Math.random() * 40) + 8 // Mock data: 8-48 hours

  return { completed, streak, hours }
}

export const calculateStreak = (activities: ActivityEntry[]) => {
  let streak = 0
  const today = new Date()
  
  for (let i = 0; i < 30; i++) {
    const checkDate = new Date(today)
    checkDate.setDate(checkDate.getDate() - i)
    checkDate.setHours(0, 0, 0, 0)
    
    const hasActivity = activities.some((a) => {
      const actDate = new Date(a.date)
      actDate.setHours(0, 0, 0, 0)
      return actDate.getTime() === checkDate.getTime()
    })
    
    if (hasActivity) {
      streak++
    } else {
      break
    }
  }
  
  return streak
}

export const formatDate = (date: Date): string => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  
  const checkDate = new Date(date)
  checkDate.setHours(0, 0, 0, 0)
  
  if (checkDate.getTime() === today.getTime()) {
    return 'Today'
  } else if (checkDate.getTime() === yesterday.getTime()) {
    return 'Yesterday'
  } else {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }
}

export const groupActivitiesByDate = (activities: ActivityEntry[]) => {
  const groups: Record<string, ActivityEntry[]> = {}
  
  activities.forEach((activity) => {
    const dateStr = formatDate(activity.date)
    if (!groups[dateStr]) {
      groups[dateStr] = []
    }
    groups[dateStr].push(activity)
  })
  
  return groups
}
export interface UserProfile {
  id: string
  name: string
  handle: string
  email?: string
  avatar: string
  banner: string
  bio: string
  location: string
  joinDate: string
  verified: boolean
  rank: string
  website: string
  reviews: number
  articles: number
  followers: number
  following: number
  isFollowing: boolean
}

export const mockUser: UserProfile = {
  id: "1",
  name: "Aoi Tanaka",
  handle: "@aoi_reads",
  email: "aoi@example.com",
  bio: "Chronicling every arc, panel, and page. Perpetual wanderer between fiction and reality.",
  location: "Kyoto, Japan",
  joined: "Joined March 2023",
  joinDate: "March 2023",
  avatar: "/media/poster-5.png",
  banner: "/media/banner.png",
  verified: true,
  rank: "Elite Reader",
  website: "wonderfool.com/aoi",
  followers: 15400,
  following: 243,
  reviews: 42,
  articles: 12,
  isFollowing: false
};

export type Review = {
  id: number;
  title: string;
  animeTitle: string;
  rating: number;
  content: string;
  date: string;
  posterUrl: string;
  likes: number;
  comments: number;
  readTime: string;
};

export const mockReviews: Review[] = [
  {
    id: 1,
    title: "Blade of the Fallen Petal",
    animeTitle: "Samurai Champloo",
    rating: 5,
    content: "A breathtaking finale. The final duel under the sakura tree will stay with me.",
    date: "May 18, 2026",
    posterUrl: "/media/poster-1.png",
    likes: 120,
    comments: 15,
    readTime: "5 min read"
  }
];

export type Article = {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
};

export const mockArticles: Article[] = [
  {
    id: 1,
    title: "Top 10 Anime of 2025",
    excerpt: "A look back at the best anime of the past year.",
    date: "Dec 31, 2025",
    readTime: "10 min read"
  }
];

export type WishlistItem = {
  id: number | string;
  name: string;
  category: string;
  addedDate: string;
  coverUrl?: string;
  seriesId?: string;
};

export const mockWishlist: WishlistItem[] = [
  {
    id: 1,
    name: "The Cursed Sorcerer Vol. 1",
    category: "Manga",
    addedDate: "Added May 10, 2026"
  }
];
