import { Container } from "inversify"
import { UsersController } from "../users/usersController"
import { UsersService } from "../users/usersService"
import { UsersRepository } from "../users/usersRepository"
import { UsersQueryRepository } from "../users/usersQueryRepository"
import { EmailService } from "./emailService"
import { EmailRepository } from "./emailRepository"
import { JwtService } from "./jwtService"
import { SecurityService } from "../security/securityService"
import { SecurityRepository } from "../security/securityRepository"
import { PasswordService } from "./passwordService"
import { AuthRepository } from "../auth/authRepository"
import { AuthService } from "../auth/authService"
import { AuthController } from "../auth/authController"
import { SecurityController } from "../security/securityController"
import { TokenAuthMiddleware } from "../auth/middlewares/tokenAuthMiddleware"
import { PaginationQueries } from "./paginationQueries"
import { RefreshTokenValidator } from "../auth/middlewares/refreshTokenMiddleware"
import { ErrorResultMiddleware } from "../../globalMiddlewares/errorResultMiddleware"
import { PostsController } from "../posts/postsController"
import { PostsService } from "../posts/postsService"
import { PostsRepository } from "../posts/postsRepository"
import { PostsQueryRepository } from "../posts/postsQueryRepository"
import { CommentsController } from "../comments/commentsController"
import { CommentsService } from "../comments/commentsService"
import { CommentsRepository } from "../comments/commentsRepository"
import { CommentsQueryRepository } from "../comments/commentsQueryRepository"
import { BlogsController } from "../blogs/blogsController"
import { BlogsService } from "../blogs/blogsService"
import { BlogsRepository } from "../blogs/blogsRepository"
import { BlogsQueryRepository } from "../blogs/blogsQueryRepository"

// Основной контейнер
export const container: Container = new Container()

// Привязка контроллеров
container.bind<UsersController>(UsersController).toSelf()
container.bind<AuthController>(AuthController).toSelf()
container.bind<SecurityController>(SecurityController).toSelf()
container.bind<PostsController>(PostsController).toSelf()
container.bind<CommentsController>(CommentsController).toSelf()
container.bind<BlogsController>(BlogsController).toSelf()

// Привязка сервисов
container.bind<UsersService>(UsersService).toSelf()
container.bind<EmailService>(EmailService).toSelf()
container.bind<JwtService>(JwtService).toSelf()
container.bind<SecurityService>(SecurityService).toSelf()
container.bind<PasswordService>(PasswordService).toSelf()
container.bind<AuthService>(AuthService).toSelf()
container.bind<PostsService>(PostsService).toSelf()
container.bind<CommentsService>(CommentsService).toSelf()
container.bind<BlogsService>(BlogsService).toSelf()

// Привязка репозиториев
container.bind<UsersRepository>(UsersRepository).toSelf()
container.bind<UsersQueryRepository>(UsersQueryRepository).toSelf()
container.bind<EmailRepository>(EmailRepository).toSelf()
container.bind<SecurityRepository>(SecurityRepository).toSelf()
container.bind<AuthRepository>(AuthRepository).toSelf()
container.bind<PostsRepository>(PostsRepository).toSelf()
container.bind<PostsQueryRepository>(PostsQueryRepository).toSelf()
container.bind<CommentsRepository>(CommentsRepository).toSelf()
container.bind<CommentsQueryRepository>(CommentsQueryRepository).toSelf()
container.bind<BlogsRepository>(BlogsRepository).toSelf()
container.bind<BlogsQueryRepository>(BlogsQueryRepository).toSelf()

//Привязка мидлваров
container.bind<TokenAuthMiddleware>(TokenAuthMiddleware).toSelf()
container.bind<RefreshTokenValidator>(RefreshTokenValidator).toSelf()
container.bind<ErrorResultMiddleware>(ErrorResultMiddleware).toSelf()
//Остальное
container.bind<PaginationQueries>(PaginationQueries).toSelf()