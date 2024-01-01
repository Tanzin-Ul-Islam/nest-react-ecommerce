import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtAuthService {
    constructor(private jwtService: JwtService) { }
    generateAccessToken(arg: any) {
        const token = this.jwtService.sign(arg, { secret: process.env.JWT_ACCESS_SECRET, expiresIn: '1h' });
        return token;
    }
    generateRefreshToken(arg: any) {
        const token = this.jwtService.sign(arg, { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '4h' });
        return token;
    }
    decodeAccessToken(token: string) {
        try {
            const response = this.jwtService.verify(token, { secret: process.env.JWT_ACCESS_SECRET });
            return response;
        } catch (error) {
            return;
        }
    }
    decodeRefreshToken(token: string) {
        try {
            const response = this.jwtService.verify(token, { secret: process.env.JWT_REFRESH_SECRET });
            return response;
        } catch (error) {
            return;
        }
    }

    generateJwtTokens(arg: any) {
        const accessToken = this.generateAccessToken(arg);
        const refreshToken = this.generateRefreshToken(arg);
        return {
            accessToken,
            refreshToken
        }
    }
}