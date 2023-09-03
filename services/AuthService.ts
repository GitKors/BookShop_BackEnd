import { injectable, inject } from 'inversify';
import { compare, hash } from 'bcrypt';
import { sign, Secret } from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import TYPES from '../types'; 

@injectable()
export class AuthService {
  private prisma: PrismaClient;

  constructor(@inject(TYPES.PrismaClient) prisma: PrismaClient) {
    this.prisma = prisma;
  }

  public async login(login: string, password: string): Promise<string> { 
    const user = await this.prisma.user.findUnique({ where: { username: login } }); 
    if (!user) {
      throw new Error('Пользователь не найден');
    }
  
    const passwordsMatch = await compare(password, user.password);
    if (!passwordsMatch) {
      throw new Error('Неверный пароль');
    }
  
    const token = this.generateToken(user.id);
    return token;
  }
  
  public async register(username: string, password: string): Promise<void> {
    const existingUser = await this.prisma.user.findUnique({ where: { username } });

    if (existingUser) {
      throw new Error('Пользователь с таким именем уже существует.');
    }

    const hashedPassword = await hash(password, 10);
    await this.prisma.user.create({
        data: {
            password: hashedPassword,
            username: username
        }
    });
  }
  
  private generateToken(userId: number): string {
    const token = sign({ userId }, process.env.JWTSECRET as Secret, { expiresIn: '1h' });
    return token;
  }
}
