// Mock data and functions - In a real app, this would connect to a database

export interface Game {
  id: string
  name: string
  description: string
  category: string
  image: string
  gallery?: string[] // Additional images
  minPlayers: number
  maxPlayers: number
  playtime: number
  rating: number
  reviewCount: number
  components: string[]
  tutorialUrl?: string
  tutorialTitle?: string
  rulesUrl?: string
  howToPlayUrl?: string
  featured: boolean
  createdAt: Date
  updatedAt: Date
  status: "published" | "draft" | "archived"
  publisher?: string
  designer?: string
  yearPublished?: number
  complexity?: number
  tags?: string[]
}

export interface Review {
  id: string
  gameId: string
  userId: string
  userName: string
  userEmail: string
  rating: number
  comment: string
  createdAt: Date
  updatedAt: Date
  status: "approved" | "pending" | "rejected"
  helpful: number
}

export interface User {
  id: string
  name: string
  email: string
  role: "user" | "admin"
  avatar?: string
  createdAt: Date
  updatedAt: Date
  status: "active" | "suspended" | "banned"
  reviewCount: number
  lastLogin?: Date
}

export interface AdminStats {
  totalGames: number
  totalUsers: number
  totalReviews: number
  averageRating: number
  pendingReviews: number
  activeUsers: number
  gamesThisMonth: number
  reviewsThisMonth: number
}

// Categories data structure
export const gameCategories = [
  {
    id: "strategy",
    name: "Strategy",
    description: "Deep thinking and planning games that challenge your tactical skills",
    icon: "Puzzle",
    count: 0, // Will be calculated dynamically
    color: "bg-blue-500",
    featured: true,
  },
  {
    id: "family",
    name: "Family",
    description: "Fun games perfect for all ages and family game nights",
    icon: "Heart",
    count: 0,
    color: "bg-green-500",
    featured: true,
  },
  {
    id: "party",
    name: "Party",
    description: "Social and entertaining games for groups and gatherings",
    icon: "Users",
    count: 0,
    color: "bg-purple-500",
    featured: true,
  },
  {
    id: "cooperative",
    name: "Cooperative",
    description: "Work together as a team to achieve victory",
    icon: "Gamepad2",
    count: 0,
    color: "bg-orange-500",
    featured: true,
  },
  {
    id: "deck-building",
    name: "Deck Building",
    description: "Build and customize your deck as you play",
    icon: "Layers",
    count: 0,
    color: "bg-indigo-500",
    featured: false,
  },
  {
    id: "worker-placement",
    name: "Worker Placement",
    description: "Strategic placement of workers to gather resources",
    icon: "Users2",
    count: 0,
    color: "bg-cyan-500",
    featured: false,
  },
  {
    id: "area-control",
    name: "Area Control",
    description: "Control territories and regions to dominate the board",
    icon: "Map",
    count: 0,
    color: "bg-red-500",
    featured: false,
  },
  {
    id: "abstract",
    name: "Abstract",
    description: "Pure strategy games without thematic elements",
    icon: "Circle",
    count: 0,
    color: "bg-gray-500",
    featured: false,
  },
  {
    id: "thematic",
    name: "Thematic",
    description: "Immersive games with rich themes and storytelling",
    icon: "BookOpen",
    count: 0,
    color: "bg-pink-500",
    featured: false,
  },
]

// Mock data
const mockGames: Game[] = [
  {
    id: "1",
    name: "Wingspan",
    description: "A competitive, medium-weight, card-driven, engine-building board game from Stonemaier Games.",
    category: "Strategy",
    image: "/placeholder.svg?height=300&width=400&text=Wingspan",
    gallery: [
      "/placeholder.svg?height=300&width=400&text=Wingspan+Board",
      "/placeholder.svg?height=300&width=400&text=Wingspan+Cards",
      "/placeholder.svg?height=300&width=400&text=Wingspan+Components",
    ],
    minPlayers: 1,
    maxPlayers: 5,
    playtime: 70,
    rating: 4.8,
    reviewCount: 1250,
    components: ["170 Bird Cards", "26 Bonus Cards", "16 Automa Cards", "103 Food Tokens", "75 Egg Miniatures"],
    tutorialUrl: "https://www.youtube.com/watch?v=wingspan-tutorial",
    tutorialTitle: "How to Play Wingspan - Official Tutorial",
    rulesUrl: "https://stonemaiergames.com/games/wingspan/rules/",
    howToPlayUrl: "https://www.youtube.com/watch?v=wingspan-howto",
    featured: true,
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2024-01-01"),
    status: "published",
    publisher: "Stonemaier Games",
    designer: "Elizabeth Hargrave",
    yearPublished: 2019,
    complexity: 2.4,
    tags: ["Engine Building", "Card Drafting", "Set Collection"],
  },
  {
    id: "2",
    name: "Azul",
    description: "A tile-placement game where players compete to create the most beautiful wall.",
    category: "Family",
    image: "/placeholder.svg?height=300&width=400&text=Azul",
    gallery: [
      "/placeholder.svg?height=300&width=400&text=Azul+Board",
      "/placeholder.svg?height=300&width=400&text=Azul+Tiles",
      "/placeholder.svg?height=300&width=400&text=Azul+Components",
    ],
    minPlayers: 2,
    maxPlayers: 4,
    playtime: 45,
    rating: 4.6,
    reviewCount: 890,
    components: ["100 Resin Tiles", "4 Player Boards", "9 Factory Displays", "4 Scoring Markers"],
    tutorialUrl: "https://www.youtube.com/watch?v=azul-tutorial",
    tutorialTitle: "How to Play Azul - Official Tutorial",
    rulesUrl: "https://plangames.com/games/azul/rules/",
    howToPlayUrl: "https://www.youtube.com/watch?v=azul-howto",
    featured: true,
    createdAt: new Date("2023-01-02"),
    updatedAt: new Date("2024-01-02"),
    status: "published",
    publisher: "Plan B Games",
    designer: "Michael Kiesling",
    yearPublished: 2017,
    complexity: 1.8,
    tags: ["Tile Placement", "Pattern Building", "Drafting"],
  },
  {
    id: "3",
    name: "Pandemic",
    description: "A cooperative board game where players work together to treat infections around the world.",
    category: "Cooperative",
    image: "/placeholder.svg?height=300&width=400&text=Pandemic",
    gallery: [
      "/placeholder.svg?height=300&width=400&text=Pandemic+Board",
      "/placeholder.svg?height=300&width=400&text=Pandemic+Components",
      "/placeholder.svg?height=300&width=400&text=Pandemic+Cards",
    ],
    minPlayers: 2,
    maxPlayers: 4,
    playtime: 60,
    rating: 4.7,
    reviewCount: 2100,
    components: ["1 Board", "7 Role Cards", "59 Player Cards", "48 Infection Cards", "96 Disease Cubes"],
    tutorialUrl: "https://www.youtube.com/watch?v=pandemic-tutorial",
    tutorialTitle: "How to Play Pandemic - Official Tutorial",
    rulesUrl: "https://zmangames.com/games/pandemic/rules/",
    howToPlayUrl: "https://www.youtube.com/watch?v=pandemic-howto",
    featured: true,
    createdAt: new Date("2023-01-03"),
    updatedAt: new Date("2024-01-03"),
    status: "published",
    publisher: "Z-Man Games",
    designer: "Matt Leacock",
    yearPublished: 2008,
    complexity: 2.4,
    tags: ["Cooperative", "Hand Management", "Set Collection"],
  },
  {
    id: "4",
    name: "Ticket to Ride",
    description: "A railway-themed German-style board game designed by Alan R. Moon.",
    category: "Family",
    image: "/placeholder.svg?height=300&width=400&text=Ticket+to+Ride",
    gallery: [
      "/placeholder.svg?height=300&width=400&text=Ticket+to+Ride+Map",
      "/placeholder.svg?height=300&width=400&text=Ticket+to+Ride+Train+Cars",
      "/placeholder.svg?height=300&width=400&text=Ticket+to+Ride+Destination+Tickets",
    ],
    minPlayers: 2,
    maxPlayers: 5,
    playtime: 60,
    rating: 4.5,
    reviewCount: 1800,
    components: ["1 Board Map", "240 Colored Train Cars", "110 Train Car Cards", "30 Destination Tickets"],
    tutorialUrl: "https://www.youtube.com/watch?v=ticket-to-ride-tutorial",
    tutorialTitle: "How to Play Ticket to Ride - Official Tutorial",
    rulesUrl: "https://daysofwonder.com/games/ticket-to-ride/rules/",
    howToPlayUrl: "https://www.youtube.com/watch?v=ticket-to-ride-howto",
    featured: false,
    createdAt: new Date("2023-01-04"),
    updatedAt: new Date("2024-01-04"),
    status: "published",
    publisher: "Days of Wonder",
    designer: "Alan R. Moon",
    yearPublished: 2004,
    complexity: 1.8,
    tags: ["Route Building", "Set Collection", "Hand Management"],
  },
  {
    id: "5",
    name: "Splendor",
    description: "A fast-paced and addictive game of chip-collecting and card development.",
    category: "Strategy",
    image: "/placeholder.svg?height=300&width=400&text=Splendor",
    gallery: [
      "/placeholder.svg?height=300&width=400&text=Splendor+Board",
      "/placeholder.svg?height=300&width=400&text=Splendor+Development+Cards",
      "/placeholder.svg?height=300&width=400&text=Splendor+Noble+Tiles",
    ],
    minPlayers: 2,
    maxPlayers: 4,
    playtime: 30,
    rating: 4.4,
    reviewCount: 950,
    components: ["40 Gem Tokens", "90 Development Cards", "10 Noble Tiles"],
    tutorialUrl: "https://www.youtube.com/watch?v=splendor-tutorial",
    tutorialTitle: "How to Play Splendor - Official Tutorial",
    rulesUrl: "https://spacecowboys.com/games/splendor/rules/",
    howToPlayUrl: "https://www.youtube.com/watch?v=splendor-howto",
    featured: false,
    createdAt: new Date("2023-01-05"),
    updatedAt: new Date("2024-01-05"),
    status: "published",
    publisher: "Space Cowboys",
    designer: "Marc André",
    yearPublished: 2014,
    complexity: 2.3,
    tags: ["Engine Building", "Set Collection", "Card Drafting"],
  },
  {
    id: "6",
    name: "Catan",
    description: "A multiplayer board game designed by Klaus Teuber, first published in 1995.",
    category: "Strategy",
    image: "/placeholder.svg?height=300&width=400&text=Catan",
    gallery: [
      "/placeholder.svg?height=300&width=400&text=Catan+Board",
      "/placeholder.svg?height=300&width=400&text=Catan+Terrain+Hexes",
      "/placeholder.svg?height=300&width=400&text=Catan+Harbor+Pieces",
    ],
    minPlayers: 3,
    maxPlayers: 4,
    playtime: 75,
    rating: 4.3,
    reviewCount: 3200,
    components: ["19 Terrain Hexes", "6 Sea Frame Pieces", "9 Harbor Pieces", "18 Number Tokens"],
    tutorialUrl: "https://www.youtube.com/watch?v=catan-tutorial",
    tutorialTitle: "How to Play Catan - Official Tutorial",
    rulesUrl: "https://catanstudio.com/games/catan/rules/",
    howToPlayUrl: "https://www.youtube.com/watch?v=catan-howto",
    featured: false,
    createdAt: new Date("2023-01-06"),
    updatedAt: new Date("2024-01-06"),
    status: "published",
    publisher: "Catan Studio",
    designer: "Klaus Teuber",
    yearPublished: 1995,
    complexity: 2.3,
    tags: ["Trading", "Dice Rolling", "Modular Board"],
  },
]

const mockReviews: Review[] = [
  {
    id: "1",
    gameId: "1",
    userId: "user1",
    userName: "BoardGameFan",
    userEmail: "fan@example.com",
    rating: 5,
    comment: "Absolutely love this game! The artwork is beautiful and the gameplay is engaging.",
    createdAt: new Date("2023-12-01"),
    updatedAt: new Date("2023-12-01"),
    status: "approved",
    helpful: 15,
  },
  {
    id: "2",
    gameId: "1",
    userId: "user2",
    userName: "StrategyMaster",
    userEmail: "strategy@example.com",
    rating: 4,
    comment: "Great engine-building mechanics. Takes a few plays to master but very rewarding.",
    createdAt: new Date("2023-12-02"),
    updatedAt: new Date("2023-12-02"),
    status: "approved",
    helpful: 8,
  },
  {
    id: "3",
    gameId: "2",
    userId: "user3",
    userName: "FamilyGamer",
    userEmail: "family@example.com",
    rating: 5,
    comment: "Perfect family game! Easy to learn but has depth.",
    createdAt: new Date("2023-12-03"),
    updatedAt: new Date("2023-12-03"),
    status: "pending",
    helpful: 3,
  },
  {
    id: "4",
    gameId: "3",
    userId: "user4",
    userName: "CoopLover",
    userEmail: "coop@example.com",
    rating: 4,
    comment: "Best cooperative game ever! Challenging but fair.",
    createdAt: new Date("2023-12-04"),
    updatedAt: new Date("2023-12-04"),
    status: "approved",
    helpful: 12,
  },
]

const mockUsers: User[] = [
  {
    id: "user1",
    name: "BoardGameFan",
    email: "fan@example.com",
    role: "user",
    avatar: "/placeholder.svg?height=40&width=40",
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2024-01-01"),
    status: "active",
    reviewCount: 25,
    lastLogin: new Date("2024-01-15"),
  },
  {
    id: "user2",
    name: "StrategyMaster",
    email: "strategy@example.com",
    role: "user",
    avatar: "/placeholder.svg?height=40&width=40",
    createdAt: new Date("2023-02-01"),
    updatedAt: new Date("2024-01-10"),
    status: "active",
    reviewCount: 18,
    lastLogin: new Date("2024-01-14"),
  },
  {
    id: "user3",
    name: "FamilyGamer",
    email: "family@example.com",
    role: "user",
    avatar: "/placeholder.svg?height=40&width=40",
    createdAt: new Date("2023-03-01"),
    updatedAt: new Date("2024-01-05"),
    status: "active",
    reviewCount: 12,
    lastLogin: new Date("2024-01-13"),
  },
  {
    id: "user4",
    name: "SpamUser",
    email: "spam@example.com",
    role: "user",
    avatar: "/placeholder.svg?height=40&width=40",
    createdAt: new Date("2023-06-01"),
    updatedAt: new Date("2023-12-01"),
    status: "suspended",
    reviewCount: 2,
    lastLogin: new Date("2023-12-01"),
  },
  {
    id: "admin1",
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
    avatar: "/placeholder.svg?height=40&width=40",
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2024-01-15"),
    status: "active",
    reviewCount: 5,
    lastLogin: new Date("2024-01-15"),
  },
]

// Search function for suggestions
export async function searchGames(query: string): Promise<Game[]> {
  await new Promise((resolve) => setTimeout(resolve, 200)) // Simulate API delay

  const searchTerm = query.toLowerCase().trim()

  return mockGames
    .filter(
      (game) =>
        game.status === "published" &&
        (game.name.toLowerCase().includes(searchTerm) ||
          game.description.toLowerCase().includes(searchTerm) ||
          game.category.toLowerCase().includes(searchTerm) ||
          game.publisher?.toLowerCase().includes(searchTerm) ||
          game.designer?.toLowerCase().includes(searchTerm) ||
          game.tags?.some((tag) => tag.toLowerCase().includes(searchTerm))),
    )
    .sort((a, b) => {
      // Prioritize exact name matches
      const aNameMatch = a.name.toLowerCase().startsWith(searchTerm)
      const bNameMatch = b.name.toLowerCase().startsWith(searchTerm)

      if (aNameMatch && !bNameMatch) return -1
      if (!aNameMatch && bNameMatch) return 1

      // Then sort by rating
      return b.rating - a.rating
    })
}

// Game functions
export async function getGames(
  params: {
    search?: string
    category?: string
    players?: string
    playtime?: string
    page?: string
    status?: string
  } = {},
) {
  await new Promise((resolve) => setTimeout(resolve, 100))

  let filteredGames = [...mockGames]

  if (params.search) {
    filteredGames = filteredGames.filter(
      (game) =>
        game.name.toLowerCase().includes(params.search!.toLowerCase()) ||
        game.description.toLowerCase().includes(params.search!.toLowerCase()),
    )
  }

  if (params.category && params.category !== "all-categories") {
    filteredGames = filteredGames.filter((game) => game.category.toLowerCase() === params.category!.toLowerCase())
  }

  if (params.players && params.players !== "any-number") {
    const playerCount = params.players === "5+" ? 5 : Number.parseInt(params.players)
    filteredGames = filteredGames.filter((game) => game.minPlayers <= playerCount && game.maxPlayers >= playerCount)
  }

  if (params.playtime) {
    const maxPlaytime = Number.parseInt(params.playtime)
    filteredGames = filteredGames.filter((game) => game.playtime <= maxPlaytime)
  }

  if (params.status) {
    filteredGames = filteredGames.filter((game) => game.status === params.status)
  }

  const page = Number.parseInt(params.page || "1")
  const pageSize = 9
  const totalPages = Math.ceil(filteredGames.length / pageSize)
  const startIndex = (page - 1) * pageSize
  const paginatedGames = filteredGames.slice(startIndex, startIndex + pageSize)

  return {
    games: paginatedGames,
    totalPages,
    currentPage: page,
    totalCount: filteredGames.length,
  }
}

export async function getFeaturedGames() {
  await new Promise((resolve) => setTimeout(resolve, 100))
  return mockGames.filter((game) => game.featured)
}

export async function getGameById(id: string) {
  await new Promise((resolve) => setTimeout(resolve, 100))
  return mockGames.find((game) => game.id === id)
}

export async function getAllGames() {
  await new Promise((resolve) => setTimeout(resolve, 100))
  return mockGames
}

export async function getSimilarGames(currentGame: Game) {
  await new Promise((resolve) => setTimeout(resolve, 100))
  return mockGames
    .filter(
      (game) =>
        game.id !== currentGame.id &&
        (game.category === currentGame.category || Math.abs(game.playtime - currentGame.playtime) <= 30),
    )
    .slice(0, 3)
}

// CRUD operations (mock implementations)
export async function updateGame(id: string, gameData: Partial<Game>) {
  await new Promise((resolve) => setTimeout(resolve, 500))
  const gameIndex = mockGames.findIndex((game) => game.id === id)
  if (gameIndex !== -1) {
    mockGames[gameIndex] = { ...mockGames[gameIndex], ...gameData, updatedAt: new Date() }
    return mockGames[gameIndex]
  }
  throw new Error("Game not found")
}

export async function deleteGame(id: string) {
  await new Promise((resolve) => setTimeout(resolve, 500))
  const gameIndex = mockGames.findIndex((game) => game.id === id)
  if (gameIndex !== -1) {
    mockGames.splice(gameIndex, 1)
    return true
  }
  throw new Error("Game not found")
}

// Review functions
export async function getGameReviews(gameId: string) {
  await new Promise((resolve) => setTimeout(resolve, 100))
  return mockReviews.filter((review) => review.gameId === gameId)
}

export async function getAllReviews(params: { status?: string; page?: string } = {}) {
  await new Promise((resolve) => setTimeout(resolve, 100))

  let filteredReviews = [...mockReviews]

  if (params.status && params.status !== "all") {
    filteredReviews = filteredReviews.filter((review) => review.status === params.status)
  }

  const page = Number.parseInt(params.page || "1")
  const pageSize = 10
  const totalPages = Math.ceil(filteredReviews.length / pageSize)
  const startIndex = (page - 1) * pageSize
  const paginatedReviews = filteredReviews.slice(startIndex, startIndex + pageSize)

  return {
    reviews: paginatedReviews,
    totalPages,
    currentPage: page,
    totalCount: filteredReviews.length,
  }
}

// User functions
export async function getAllUsers(params: { status?: string; page?: string; search?: string } = {}) {
  await new Promise((resolve) => setTimeout(resolve, 100))

  let filteredUsers = [...mockUsers]

  if (params.search) {
    filteredUsers = filteredUsers.filter(
      (user) =>
        user.name.toLowerCase().includes(params.search!.toLowerCase()) ||
        user.email.toLowerCase().includes(params.search!.toLowerCase()),
    )
  }

  if (params.status && params.status !== "all") {
    filteredUsers = filteredUsers.filter((user) => user.status === params.status)
  }

  const page = Number.parseInt(params.page || "1")
  const pageSize = 10
  const totalPages = Math.ceil(filteredUsers.length / pageSize)
  const startIndex = (page - 1) * pageSize
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + pageSize)

  return {
    users: paginatedUsers,
    totalPages,
    currentPage: page,
    totalCount: filteredUsers.length,
  }
}

export async function getUserById(id: string) {
  await new Promise((resolve) => setTimeout(resolve, 100))
  return mockUsers.find((user) => user.id === id)
}

// Admin stats
export async function getAdminStats(): Promise<AdminStats> {
  await new Promise((resolve) => setTimeout(resolve, 100))

  const totalGames = mockGames.length
  const totalUsers = mockUsers.filter((user) => user.role === "user").length
  const totalReviews = mockReviews.length
  const averageRating = mockGames.reduce((sum, game) => sum + game.rating, 0) / mockGames.length
  const pendingReviews = mockReviews.filter((review) => review.status === "pending").length
  const activeUsers = mockUsers.filter((user) => user.status === "active").length

  // Mock monthly stats
  const gamesThisMonth = Math.floor(totalGames * 0.1)
  const reviewsThisMonth = Math.floor(totalReviews * 0.15)

  return {
    totalGames,
    totalUsers,
    totalReviews,
    averageRating: Number(averageRating.toFixed(1)),
    pendingReviews,
    activeUsers,
    gamesThisMonth,
    reviewsThisMonth,
  }
}

// Category functions
export async function getCategories() {
  await new Promise((resolve) => setTimeout(resolve, 100))

  // Calculate game counts for each category
  const categoriesWithCounts = gameCategories.map((category) => ({
    ...category,
    count: mockGames.filter(
      (game) => game.category.toLowerCase() === category.name.toLowerCase() && game.status === "published",
    ).length,
  }))

  return categoriesWithCounts
}

export async function getCategoryById(id: string) {
  await new Promise((resolve) => setTimeout(resolve, 100))
  const categories = await getCategories()
  return categories.find((category) => category.id === id)
}

export async function updateUser(id: string, userData: Partial<User>) {
  await new Promise((resolve) => setTimeout(resolve, 500))
  const userIndex = mockUsers.findIndex((user) => user.id === id)
  if (userIndex !== -1) {
    mockUsers[userIndex] = { ...mockUsers[userIndex], ...userData, updatedAt: new Date() }
    return mockUsers[userIndex]
  }
  throw new Error("User not found")
}

export async function deleteUser(id: string) {
  await new Promise((resolve) => setTimeout(resolve, 500))
  const userIndex = mockUsers.findIndex((user) => user.id === id)
  if (userIndex !== -1) {
    mockUsers.splice(userIndex, 1)
    return true
  }
  throw new Error("User not found")
}
