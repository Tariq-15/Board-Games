import { GameController } from "@/Controller/GameController"
import type { GameFilters, PaginatedGames, AdminStats } from "@/Controller/GameController"
import type { Game } from "@/Model/Game"

export class GameService {
  private gameController: GameController

  constructor() {
    this.gameController = new GameController()
  }

  public async getGames(searchParams: GameFilters = {}): Promise<PaginatedGames> {
    return await this.gameController.getGames(searchParams)
  }

  public async getFeaturedGames(): Promise<Game[]> {
    return await this.gameController.getFeaturedGames()
  }

  public async getGameById(id: string): Promise<Game | null> {
    return await this.gameController.getGameById(id)
  }

  public async getAllGames(): Promise<Game[]> {
    return await this.gameController.getAllGames()
  }

  public async searchGames(query: string): Promise<Game[]> {
    return await this.gameController.searchGames(query)
  }

  public async getSimilarGames(currentGame: Game): Promise<Game[]> {
    return await this.gameController.getSimilarGames(currentGame)
  }

  public async getAdminStats(): Promise<AdminStats> {
    return await this.gameController.getAdminStats()
  }

  public async updateGame(id: string, gameData: Partial<Game>): Promise<Game> {
    return await this.gameController.updateGame(id, gameData)
  }

  public async deleteGame(id: string): Promise<boolean> {
    return await this.gameController.deleteGame(id)
  }
}
